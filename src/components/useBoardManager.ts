import { uniqBy } from 'es-toolkit/compat';
import React from 'react';
import { match, P } from 'ts-pattern';
import { COLS, ROWS } from '../params';
import { LineCoord } from '../scenario/game/types';
import { copy } from '../utils';
import type { Name as TetriminoType } from '../tetrimino/types';
import { checkCompletedLines } from './boardAlgorithms';

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

  /**
   * Checks for completed lines in the board and returns the coordinates
   * of the completed lines.
   * If `clear` is true, the completed lines are also removed from the board.
   */
  const checkLines = React.useCallback(
    (clear: boolean) => {
      const completedLines = checkCompletedLines(board);
      if (clear) {
        const newMatrix = removeCompletedLines(matrix)(completedLines);
        setMatrix(newMatrix);
      }
      return completedLines;
    },
    [board],
  );

  return {
    board,
    fixPiece,
    checkLines,
  };
}

const deleteBlockOnMatrix =
  (matrix: BoardMatrix) =>
  ({ y, x, z }: { y: number; x: number; z: number }) => {
    for (let dy = y; dy > 0; dy--) {
      matrix[dy][x][z] = matrix[dy - 1][x][z];
    }
    matrix[0][x][z] = null;
  };

const linesToBlocks = (completedLines: LineCoord[]) =>
  uniqBy(
    completedLines
      .map((line) =>
        match(line)
          .with({ y: P.number, x: P.number }, ({ y, x }) =>
            Array.from({ length: COLS }, (_, z) => ({ y, x, z })),
          )
          .with({ y: P.number, z: P.number }, ({ y, z }) =>
            Array.from({ length: COLS }, (_, x) => ({ y, x, z })),
          )
          .exhaustive(),
      )
      .flat(),
    ({ x, y, z }) => `${y}.${x}.${z}`,
  );

const removeCompletedLines = (matrix: BoardMatrix) => (lines: LineCoord[]) => {
  const newMatriz = copy(matrix);
  const deleteBlock = deleteBlockOnMatrix(newMatriz);
  const blockToDelete = linesToBlocks(lines);
  blockToDelete.forEach(deleteBlock);
  return newMatriz;
};
