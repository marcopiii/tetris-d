import { difference } from 'es-toolkit';
import React from 'react';
import { MathUtils } from 'three';
import { match } from 'ts-pattern';
import { usePrevious } from '@uidotdev/usehooks';
import { ScoreEvent } from './types';
import { LineCoord } from '../../types';
import { pointsPerClear, pointsPerHardDrop } from './pointsCalculator';

const LINE_CLEAR_PER_LEVEL = 10;

type State = {
  score: number;
  lines: number;
  gainStream: Record<string, ScoreEvent>;
};

type Action =
  | { type: 'add-lines'; lines: LineCoord[] }
  | { type: 'clean-gain'; id: string }
  | { type: 'hard-drop'; length: number };

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
          const { gain, combo } = pointsPerClear(level)(effectiveLines);
          return {
            score: prev.score + gain,
            lines: prev.lines + lines.length,
            gainStream:
              lines.length > 0
                ? {
                    ...prev.gainStream,
                    [MathUtils.generateUUID()]: {
                      planeCombo: combo,
                      cascade: cascadeIndex,
                      lines: lines,
                    } satisfies ScoreEvent,
                  }
                : prev.gainStream,
          };
        })
        .with({ type: 'clean-gain' }, ({ id }) => {
          const { [id]: _, ...gainStream } = prev.gainStream;
          return { ...prev, gainStream };
        })
        .with({ type: 'hard-drop' }, ({ length }) => ({
          ...prev,
          score: prev.score + pointsPerHardDrop(length),
        }))
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

  const trackLines = (lines: LineCoord[]) =>
    dispatch({ type: 'add-lines', lines });

  const trackHardDrop = (length: number) =>
    dispatch({ type: 'hard-drop', length });

  return {
    score: state.score,
    level: getLevel(state.lines),
    gainStream: state.gainStream,
    trackLines,
    trackHardDrop,
  };
}

function getLevel(clearedLines: number) {
  return Math.floor(clearedLines / LINE_CLEAR_PER_LEVEL) + 1;
}
