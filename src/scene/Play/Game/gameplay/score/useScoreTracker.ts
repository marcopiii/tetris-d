import React from 'react';
import { Progress } from './types';
import { LineCoord } from '../../types';
import { pointsPerClear, pointsPerHardDrop } from './pointsCalculator';

const LINE_CLEAR_PER_LEVEL = 10;

export default function useScoreTracker() {
  const cascadeBuffer = React.useRef<LineCoord[]>([]);

  const [progress, addProgress] = React.useReducer(
    (prev, action: { points: number; lines: number }) => ({
      score: prev.score + action.points,
      lines: prev.lines + action.lines,
    }),
    { score: 0, lines: 0 },
  );

  const trackLineClear = (lines: LineCoord[]) => {
    const effectiveLines = lines.length
      ? [...lines, ...cascadeBuffer.current]
      : [];
    cascadeBuffer.current = effectiveLines;
    const level = getLevel(progress.lines);
    const points = pointsPerClear(level)(effectiveLines);
    addProgress({ points, lines: lines.length });
  };

  const trackHardDrop = (length: number) => {
    const points = pointsPerHardDrop(length);
    addProgress({ points, lines: 0 });
  };

  return {
    progress: {
      score: progress.score,
      level: getLevel(progress.lines),
    } satisfies Progress,
    trackProgress: {
      lineClear: trackLineClear,
      hardDrop: trackHardDrop,
    },
  };
}

function getLevel(clearedLines: number) {
  return Math.floor(clearedLines / LINE_CLEAR_PER_LEVEL) + 1;
}
