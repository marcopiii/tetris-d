import React from 'react';
import { LineCoord } from '../scenario/game/types';

const LINE_CLEAR_PER_LEVEL = 10;

type State = {
  score: number;
  lines: number;
};

export default function useScoreTracker() {
  const cascadeBuffer = React.useRef<LineCoord[]>([]);

  const [state, addLines] = React.useReducer(
    (prev: State, lines: LineCoord[]) => {
      const effectiveLines = lines.length
        ? [...lines, ...cascadeBuffer.current]
        : [];
      cascadeBuffer.current = effectiveLines;
      const base = scorePerLines(effectiveLines.length);
      const multiplier = planeMultiplier(effectiveLines);
      const gain = base * multiplier * level(prev.lines);
      return {
        score: prev.score + gain,
        lines: prev.lines + lines.length,
      };
    },
    { score: 0, lines: 0 },
  );

  return { score: state.score, level: level(state.lines), addLines };
}

function level(clearedLines: number) {
  return Math.floor(clearedLines / LINE_CLEAR_PER_LEVEL) + 1;
}

function scorePerLines(n: number) {
  if (n < 1) return 0;
  return 50 * n ** 2 + 50 * n;
}

function planeMultiplier(lines: LineCoord[]) {
  if (lines.length < 2) return 1;

  const orthogonalPlanes =
    lines.some((line) => 'x' in line) && lines.some((line) => 'z' in line);
  if (orthogonalPlanes) return 1.5;

  const parallelPlanes =
    lines.some((line) => line.x != lines[0].x) ||
    lines.some((line) => line.z != lines[0].z);
  if (parallelPlanes) return 1.25;

  return 1;
}
