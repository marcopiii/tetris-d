import { isNotNil } from 'es-toolkit/predicate';
import React from 'react';
import { match, P } from 'ts-pattern';
import { ScoreEvent } from './ScoreEvent';
import {
  HardDropData,
  LineClearData,
  PerfectClearData,
  TrackData,
  TSpinData,
  ZicData,
} from './TrackEvent';
import { Progress } from './types';
import { LineCoord } from '../../types';
import { planeComboPerLines, planeComboPerPlanes } from './comboDetector';
import {
  pointsPerHardDrop,
  pointsPerTSpin,
  pointsPerPlaneClear,
  planeComboMultiplier,
  pointsPerLines,
  pointsPerSoftDrop,
  pointsPerZic,
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

  const pushEvents = (events: ScoreEvent[]) => {
    setScoreEventStream((prev) => [...events, ...prev]);
    setTimeout(() => {
      setScoreEventStream((prev) =>
        prev.filter((e) => !events.map((e) => e.id).includes(e.id)),
      );
    }, EVENT_LIFESPAN_MS);
  };

  const digestClearing = (
    data?: LineClearData,
  ): [ScoreEvent | undefined, ScoreEvent | undefined] => {
    if (!data) return [undefined, undefined];
    const { lines, isCascade } = data;

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
      return [undefined, undefined];
    }

    const level = getLevel(progress.lines);

    const base = pointsPerLines(cascadeBuffer.current.lines.length);
    const planeCombo = planeComboPerLines(cascadeBuffer.current.lines);
    const multiplier = planeComboMultiplier(planeCombo);

    const clearLinesPoints = base * multiplier * level;
    const comboPoints = 50 * comboCounter.current * level;

    const points = clearLinesPoints + comboPoints;

    const lineClearEvent = {
      id: performance.now(),
      kind: 'line-clear',
      lines: lines,
      planeCombo: planeCombo,
      cascade: cascadeBuffer.current.clears - 1,
      points: points,
    } satisfies ScoreEvent;

    const comboEvent =
      comboCounter.current > 0
        ? ({
            id: performance.now() + 1,
            kind: 'combo',
            count: comboCounter.current,
            points: comboPoints,
          } satisfies ScoreEvent)
        : undefined;

    return [lineClearEvent, comboEvent];
  };

  const digestSoftDrop = (): ScoreEvent | undefined => {
    const points = pointsPerSoftDrop(1);
    return {
      id: performance.now(),
      kind: 'soft-drop',
      points: points,
    };
  };

  const digestHardDrop = (data: HardDropData): ScoreEvent | undefined => {
    if (data.length === 0) return;

    const points = pointsPerHardDrop(data.length);

    return {
      id: performance.now(),
      kind: 'hard-drop',
      points: points,
    };
  };

  const digestTSpin = (
    spinData: TSpinData,
    completedLines?: LineClearData,
  ): ScoreEvent | undefined => {
    const { kind, pivot } = spinData;

    // lines in the plane of the spin
    const relevantLines = completedLines?.isCascade
      ? []
      : (completedLines?.lines.filter((line) =>
          match(pivot)
            .with({ x: P.number }, () => 'z' in line)
            .with({ y: P.number }, () => 'x' in line)
            .exhaustive(),
        ) ?? []);

    const level = getLevel(progress.lines);
    const points = pointsPerTSpin(level)(relevantLines.length, kind);

    return {
      id: performance.now(),
      kind: 't-spin',
      mini: kind === 'mini',
      pivot: pivot,
      points: points,
    };
  };

  const digestZic = (
    zicData: ZicData,
    completedLines?: LineClearData,
  ): ScoreEvent | undefined => {
    const { kind } = zicData;

    // lines in the plane of the zic
    const relevantLines = (completedLines?.lines ?? []).filter((line) =>
      match(zicData.rails)
        .with(P.array({ x: P.number }), () => 'z' in line)
        .with(P.array({ z: P.number }), () => 'x' in line)
        .exhaustive(),
    );

    const level = getLevel(progress.lines);
    const points = pointsPerZic(level)(relevantLines.length, kind);

    return {
      id: performance.now(),
      kind: 'zic',
      mini: kind === 'mini',
      points: points,
    };
  };

  const digestPerfectClear = (
    data: PerfectClearData[],
  ): ScoreEvent | undefined => {
    if (data.length === 0) return;

    const planes = data.map(({ plane }) => plane);

    const level = getLevel(progress.lines);
    const basePoints = data
      .map(({ lines }) => pointsPerPlaneClear(level)(lines))
      .reduce((a, b) => a + b, 0);
    const planeCombo = planeComboPerPlanes(planes);
    const comboMultiplier = planeComboMultiplier(planeCombo);
    const points = basePoints * comboMultiplier;

    return {
      id: performance.now(),
      kind: 'perfect-clear',
      planes: planes,
      planeCombo: planeCombo,
      points: points,
    };
  };

  const track = (trackData: TrackData) => {
    const [lineClearEvent, comboEvent] = digestClearing(trackData.clearing);
    const moveEvent = match(trackData.rewardingMove)
      .with({ move: 'soft-drop' }, () => digestSoftDrop())
      .with({ move: 'hard-drop' }, (data) => digestHardDrop(data))
      .with({ move: 't-spin' }, (data) => digestTSpin(data, trackData.clearing))
      .with({ move: 'zic' }, (data) => digestZic(data, trackData.clearing))
      .otherwise(() => undefined);
    const perfectClearEvent =
      trackData.perfectClear && digestPerfectClear(trackData.perfectClear);

    const events = [
      lineClearEvent,
      comboEvent,
      moveEvent,
      perfectClearEvent,
    ].filter(isNotNil);

    pushEvents(events);
    addProgress({
      points: events.map((e) => e.points).reduce((a, b) => a + b, 0),
      lines: trackData.clearing?.lines.length ?? 0,
    });
  };

  return {
    progress: {
      score: progress.score,
      level: getLevel(progress.lines),
    } satisfies Progress,
    scoreEventStream,
    track,
  };
}

function getLevel(clearedLines: number) {
  return Math.floor(clearedLines / LINE_CLEAR_PER_LEVEL) + 1;
}
