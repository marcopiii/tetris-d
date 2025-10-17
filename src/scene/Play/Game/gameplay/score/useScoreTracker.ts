import { difference } from 'es-toolkit';
import React from 'react';
import { MathUtils } from 'three';
import { match } from 'ts-pattern';
import { usePrevious } from '@uidotdev/usehooks';
import { LineCoord } from '../../types';
import { Gain } from './types';
import calcPoints from './calcPoints';

const LINE_CLEAR_PER_LEVEL = 10;

type State = {
  score: number;
  lines: number;
  gainStream: Record<string, Gain>;
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
          const level = getLevel(prev.lines);
          const { gain, combo } = calcPoints(level)(effectiveLines);
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
    const newGain = difference(
      Object.keys(state.gainStream),
      Object.keys(prevGainStream ?? {}),
    )[0];
    setTimeout(() => {
      dispatch({ type: 'clean-gain', id: newGain });
    }, 1750);
  }, [state.gainStream]);

  const addLines = (lines: LineCoord[]) =>
    dispatch({ type: 'add-lines', lines });

  return {
    score: state.score,
    level: getLevel(state.lines),
    gainStream: state.gainStream,
    addLines,
  };
}

function getLevel(clearedLines: number) {
  return Math.floor(clearedLines / LINE_CLEAR_PER_LEVEL) + 1;
}
