import React from 'react';
import { COLS, ROWS } from '../params';
import { Name as Tetrimino } from '../tetrimino';

export type BoardBlock = Tetrimino | 'DELETE';
export type BoardMatrix = (BoardBlock | null)[][][];

const emptyMatrix: BoardMatrix = Array(ROWS)
  .fill(null)
  .map(() =>
    Array(COLS)
      .fill(null)
      .map(() => Array(COLS).fill(null)),
  );

export default function useBoardManager() {
  const [matrix, setMatrix] = React.useState(emptyMatrix);

  const flatMapBlocks = React.useCallback(
    <T>(callback: (type: BoardBlock, y: number, x: number, z: number) => T) =>
      matrix
        .flatMap((layer, y) =>
          layer.flatMap((xRow, x) =>
            xRow.flatMap((type, z) =>
              type ? callback(type, y, x, z) : undefined,
            ),
          ),
        )
        .filter((i): i is T => !!i),
    [matrix],
  );

  return {
    flatMapBlocks,
  };
}
