import React from 'react';
import { match } from 'ts-pattern';
import { LineCoord } from '../scenario/game/types';

const LINE_CLEAR_PER_LEVEL = 10;

type State = {
  score: number;
  lines: number;
  gainBuffer?: {
    lines: LineCoord[];
    points: number;
    kind: ComboKind;
    cascade: boolean;
  };
};

type Action =
  | { type: 'add-lines'; lines: LineCoord[] }
  | { type: 'reset-gain' };

export default function useScoreTracker() {
  const cascadeBuffer = React.useRef<LineCoord[]>([]);

  const [state, dispatch] = React.useReducer(
    (prev: State, action: Action) => {
      return match(action)
        .with({ type: 'add-lines' }, ({ lines }) => {
          const isCascade = cascadeBuffer.current.length > 0;
          const effectiveLines = lines.length
            ? [...lines, ...cascadeBuffer.current]
            : [];
          cascadeBuffer.current = effectiveLines;
          const base = scorePerLines(effectiveLines.length);
          const combo = comboKind(effectiveLines);
          const multiplier = planeMultiplier(combo);
          const gain = base * multiplier * level(prev.lines);
          return {
            score: prev.score + gain,
            lines: prev.lines + lines.length,
            gainBuffer:
              lines.length > 0
                ? {
                    points: gain,
                    kind: combo,
                    cascade: isCascade,
                    lines: lines,
                  }
                : prev.gainBuffer,
          };
        })
        .with({ type: 'reset-gain' }, () => {
          return { ...prev, gainBuffer: undefined };
        })
        .exhaustive();
    },
    { score: 0, lines: 0 },
  );

  React.useEffect(() => {
    if (state.gainBuffer) {
      const timeout = setTimeout(() => {
        dispatch({ type: 'reset-gain' });
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [state.gainBuffer]);

  const addLines = (lines: LineCoord[]) =>
    dispatch({ type: 'add-lines', lines });

  return {
    score: state.score,
    level: level(state.lines),
    gain: state.gainBuffer,
    addLines,
  };
}

function level(clearedLines: number) {
  return Math.floor(clearedLines / LINE_CLEAR_PER_LEVEL) + 1;
}

function scorePerLines(n: number) {
  if (n < 1) return 0;
  return 50 * n ** 2 + 50 * n;
}

function comboKind(lines: LineCoord[]): ComboKind {
  if (lines.length < 2) return 'std';

  const orthogonalPlanes =
    lines.some((line) => 'x' in line) && lines.some((line) => 'z' in line);
  if (orthogonalPlanes) return 'ort';

  const parallelPlanes =
    lines.some((line) => line.x != lines[0].x) ||
    lines.some((line) => line.z != lines[0].z);
  if (parallelPlanes) return 'par';

  return 'std';
}

function planeMultiplier(comboKind: ComboKind) {
  return match(comboKind)
    .with('std', () => 1)
    .with('par', () => 1.25)
    .with('ort', () => 1.5)
    .exhaustive();
}

type ComboKind = 'std' | 'ort' | 'par';
