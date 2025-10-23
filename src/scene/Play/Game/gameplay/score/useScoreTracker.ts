import React from 'react';
import { Progress, ScoreEvent } from './types';
import { LineCoord } from '../../types';
import { planeComboPerLines } from './comboDetector';
import { pointsPerClear, pointsPerHardDrop } from './pointsCalculator';

const LINE_CLEAR_PER_LEVEL = 10;

type CascadeBuffer = {
  lines: LineCoord[];
  clears: number;
};

export default function useScoreTracker() {
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

  const scoreEventStream = React.useRef<ScoreEvent[]>([]);

  const pushEvent = (event: ScoreEvent) => {
    scoreEventStream.current = [event, ...scoreEventStream.current];
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
      id: performance.now(),
      kind: 'line-clear',
      lines: lines,
      planeCombo: planeCombo,
      cascade: cascadeBuffer.current.clears - 1,
    };

    pushEvent(scoreEvent);
    addProgress({ points, lines: lines.length });
  };

  const trackHardDrop = (length: number) => {
    if (length === 0) return;

    const points = pointsPerHardDrop(length);

    const scoreEvent: ScoreEvent = {
      id: performance.now(),
      kind: 'hard-drop',
      length: length,
    };

    pushEvent(scoreEvent);
    addProgress({ points, lines: 0 });
  };

  return {
    progress: {
      score: progress.score,
      level: getLevel(progress.lines),
    } satisfies Progress,
    scoreEventStream: scoreEventStream.current,
    trackProgress: {
      lineClear: trackLineClear,
      hardDrop: trackHardDrop,
    },
  };
}

function getLevel(clearedLines: number) {
  return Math.floor(clearedLines / LINE_CLEAR_PER_LEVEL) + 1;
}
