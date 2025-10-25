import React from 'react';
import { match, P } from 'ts-pattern';
import { Progress, ScoreEvent, TSpinKind } from './types';
import { LineCoord } from '../../types';
import { planeComboPerLines } from './comboDetector';
import {
  pointsPerClear,
  pointsPerHardDrop,
  pointsPerTSpin,
} from './pointsCalculator';

const LINE_CLEAR_PER_LEVEL = 10;

export const EVENT_LIFESPAN_MS = 1500;

type CascadeBuffer = {
  lines: LineCoord[];
  clears: number;
};

export function useScoreTracker() {
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

  const trackLineClear = (lines: LineCoord[]) => {
    cascadeBuffer.current = {
      lines: lines.length ? [...lines, ...cascadeBuffer.current.lines] : [],
      clears: lines.length ? cascadeBuffer.current.clears + 1 : 0,
    };

    if (lines.length === 0) return;

    const level = getLevel(progress.lines);
    const points = pointsPerClear(level)(cascadeBuffer.current.lines);
    const planeCombo = planeComboPerLines(cascadeBuffer.current.lines);

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
    },
  };
}

function getLevel(clearedLines: number) {
  return Math.floor(clearedLines / LINE_CLEAR_PER_LEVEL) + 1;
}
