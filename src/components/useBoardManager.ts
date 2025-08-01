import React from 'react';
import { COLS, ROWS } from '../params';
import { copy } from '../utils';
import type { Name as TetriminoType } from '../tetrimino/types';

export type BoardMatrix = (TetriminoType | null)[][][];

const emptyMatrix: BoardMatrix = Array(ROWS)
  .fill(null)
  .map(() =>
    Array(COLS)
      .fill(null)
      .map(() => Array(COLS).fill(null)),
  );

export default function useBoardManager() {
  const [matrix, setMatrix] = React.useState(emptyMatrix);

  /**
   * The array of coordinates of the blocks that are occupied by the pieces in
   * the board (relative to the board coordinate system), and their type.
   */
  const board = React.useMemo(
    () =>
      matrix
        .flatMap((layer, y) =>
          layer.flatMap((xRow, x) =>
            xRow.map((type, z) => (type ? { type, x, y, z } : undefined)),
          ),
        )
        .filter((block) => !!block),
    [matrix],
  );

  /**
   * Copies each block of the tetrimino into the board. Alters the state of the
   * board but not the state of the current tetrimino.
   */
  const fixPiece = React.useCallback(
    (type: TetriminoType, tetrimino: { y: number; x: number; z: number }[]) => {
      const newMatrix = copy(matrix);
      tetrimino.forEach(({ y, x, z }) => {
        newMatrix[y][x][z] = type;
      });
      setMatrix(newMatrix);
    },
    [matrix],
  );

  return {
    board,
    fixPiece,
  };
}
