import React from 'react';
import { match, P } from 'ts-pattern';
import { Progress, ScoreEvent, TSpinKind } from './types';
import { LineCoord, PlaneCoords } from '../../types';
import { planeComboPerLines, planeComboPerPlanes } from './comboDetector';
import {
  pointsPerHardDrop,
  pointsPerTSpin,
  pointsPerPlaneClear,
  planeComboMultiplier,
  pointsPerLines,
} from './pointsCalculator';

const LINE_CLEAR_PER_LEVEL = 10;

export const EVENT_LIFESPAN_MS = 1500;

type CascadeBuffer = {
  lines: LineCoord[];
  clears: number;
};

export function useScoreTracker() {
  const comboCounter = React.useRef(-1);
  const cascadeBuffer = React.useRef<CascadeBuffer>({
    lines: [],
    clears: 0,
  });

  const [progress, addProgress] = React.useReducer(
    (prev, action: { points: number; lines: number }) => ({
      score: prev.score + action.points,
      lines: prev.lines + action.lines,
    }),
    { score: 0, lines: 0 },
  );

  const [scoreEventStream, setScoreEventStream] = React.useState<ScoreEvent[]>(
    [],
  );

  const pushEvent = (event: ScoreEvent) => {
    setScoreEventStream((prev) => [event, ...prev]);
    setTimeout(() => {
      setScoreEventStream((prev) => prev.filter((e) => e.id !== event.id));
    }, EVENT_LIFESPAN_MS);
  };

  const trackLineClear = (lines: LineCoord[], isCascade: boolean = false) => {
    cascadeBuffer.current = isCascade
      ? {
          lines: lines.length ? [...lines, ...cascadeBuffer.current.lines] : [],
          clears: lines.length ? cascadeBuffer.current.clears + 1 : 0,
        }
      : { lines: [...lines], clears: 0 };

    comboCounter.current = isCascade
      ? comboCounter.current
      : lines.length > 0
        ? comboCounter.current + 1
        : -1;

    if (lines.length === 0) {
      return;
    }

    const level = getLevel(progress.lines);

    const base = pointsPerLines(cascadeBuffer.current.lines.length);
    const planeCombo = planeComboPerLines(cascadeBuffer.current.lines);
    const multiplier = planeComboMultiplier(planeCombo);

    const clearLinesPoints = base * multiplier * level;
    const comboPoints = 50 * comboCounter.current * level;

    const points = clearLinesPoints + comboPoints;

    const scoreEvent: ScoreEvent = {
      id: Date.now(),
      kind: 'line-clear',
      lines: lines,
      planeCombo: planeCombo,
      cascade: cascadeBuffer.current.clears - 1,
      points: points,
    };

    pushEvent(scoreEvent);
    addProgress({ points, lines: lines.length });
  };

  const trackPerfectClear = (
    clearedPlanes: { plane: PlaneCoords; linesCount: number }[],
  ) => {
    if (clearedPlanes.length === 0) return;

    const level = getLevel(progress.lines);
    const basePoints = clearedPlanes
      .map(({ linesCount }) => pointsPerPlaneClear(level)(linesCount))
      .reduce((a, b) => a + b, 0);
    const planeCombo = planeComboPerPlanes(
      clearedPlanes.map(({ plane }) => plane),
    );
    const comboMultiplier = planeComboMultiplier(planeCombo);
    const points = basePoints * comboMultiplier;

    const scoreEvent: ScoreEvent = {
      id: Date.now(),
      kind: 'perfect-clear',
      planes: clearedPlanes.map(({ plane }) => plane),
      planeCombo: planeCombo,
      points: points,
    };

    pushEvent(scoreEvent);
    addProgress({ points, lines: 0 });
  };

  const trackHardDrop = (length: number) => {
    if (length === 0) return;

    const points = pointsPerHardDrop(length);

    const scoreEvent: ScoreEvent = {
      id: Date.now(),
      kind: 'hard-drop',
      length: length,
      points: points,
    };

    pushEvent(scoreEvent);
    addProgress({ points, lines: 0 });
  };

  const trackTSpin = (
    spinData: [TSpinKind, LineCoord] | undefined,
    completedLines: LineCoord[],
  ) => {
    if (!spinData) return;
    const [kind, pivot] = spinData;

    const relevantLines = completedLines.filter((line) =>
      match(pivot)
        .with({ x: P.number }, () => 'z' in line)
        .with({ y: P.number }, () => 'x' in line)
        .exhaustive(),
    );

    const level = getLevel(progress.lines);
    const points = pointsPerTSpin(level)(relevantLines.length, kind);

    const scoreEvent: ScoreEvent = {
      id: Date.now(),
      kind: 't-spin',
      mini: kind === 'mini',
      pivot: pivot,
      points: points,
    };

    pushEvent(scoreEvent);
    addProgress({ points, lines: 0 });
  };

  return {
    progress: {
      score: progress.score,
      level: getLevel(progress.lines),
    } satisfies Progress,
    scoreEventStream: scoreEventStream,
    trackProgress: {
      lineClear: trackLineClear,
      hardDrop: trackHardDrop,
      tSpin: trackTSpin,
      perfectClear: trackPerfectClear,
    },
  };
}

function getLevel(clearedLines: number) {
  return Math.floor(clearedLines / LINE_CLEAR_PER_LEVEL) + 1;
}
