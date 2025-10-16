import React from 'react';
import { MathUtils } from 'three';
import { match } from 'ts-pattern';
import { LineCoord } from '../scenario/game/types';
import { usePrevious } from '@uidotdev/usehooks';

const LINE_CLEAR_PER_LEVEL = 10;

type State = {
  score: number;
  lines: number;
  gainStream: Record<
    string,
    {
      lines: LineCoord[];
      kind: ComboKind;
      cascade: number;
      points: number;
    }
  >;
};

type Action =
  | { type: 'add-lines'; lines: LineCoord[] }
  | { type: 'clean-gain'; id: string };

export default function useScoreTracker() {
  const cascadeBuffer = React.useRef<LineCoord[]>([]);

  const [state, dispatch] = React.useReducer(
    (prev: State, action: Action) => {
      return match(action)
        .with({ type: 'add-lines' }, ({ lines }) => {
          const cascadeIndex = cascadeBuffer.current.length;
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
            gainStream:
              lines.length > 0
                ? {
                    ...prev.gainStream,
                    [MathUtils.generateUUID()]: {
                      points: gain,
                      kind: combo,
                      cascade: cascadeIndex,
                      lines: lines,
                    },
                  }
                : prev.gainStream,
          };
        })
        .with({ type: 'clean-gain' }, ({ id }) => {
          const { [id]: _, ...gainStream } = prev.gainStream;
          return { ...prev, gainStream };
        })
        .exhaustive();
    },
    { score: 0, lines: 0, gainStream: {} },
  );

  const prevGainStream = usePrevious(state.gainStream);

  React.useEffect(() => {
    const g = diffKeys(prevGainStream ?? {}, state.gainStream)[0];
    setTimeout(() => {
      dispatch({ type: 'clean-gain', id: g });
    }, 1750);
  }, [state.gainStream]);

  const addLines = (lines: LineCoord[]) =>
    dispatch({ type: 'add-lines', lines });

  return {
    score: state.score,
    level: level(state.lines),
    gainStream: state.gainStream,
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

function diffKeys<T>(a: Record<string, T>, b: Record<string, T>): string[] {
  return Object.keys(b).filter((key) => !(key in a));
}
