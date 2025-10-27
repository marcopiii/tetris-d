import { cloneDeep, noop, uniqBy } from 'es-toolkit';
import React, { useEffect } from 'react';
import { match, P } from 'ts-pattern';
import { emptyMatrix } from './matrices';
import { BoardMatrix } from './types';
import { Tetrimino } from '~/tetrimino';
import { COLS } from '../../params';
import { LineCoord } from '../../types';
import checkCompletedLines from '../checkCompletedLines';

export function useBoardManager(effect: {
  onLinesDeleted: (cascadeCompletedLines: LineCoord[]) => void;
  onPieceFixed: (completedLines: LineCoord[]) => void;
}) {
  const [matrix, setMatrix] = React.useState<BoardMatrix>(emptyMatrix);
  const triggerRef = React.useRef<'piece-fix' | 'line-clear'>(undefined);

  /**
   * The array of coordinates of the blocks that are occupied by the pieces in
   * the board (relative to the board coordinate system), and their type.
   */
  const board = matrix
    .flatMap((layer, y) =>
      layer.flatMap((xRow, x) =>
        xRow.map((type, z) => (type ? { type, x, y, z } : undefined)),
      ),
    )
    .filter((block) => !!block);

  /**
   * Copies each block of the tetrimino into the board. Alters the state of the
   * board but not the state of the current tetrimino.
   */
  const fixPiece = (
    type: Tetrimino,
    tetrimino: { y: number; x: number; z: number }[],
  ) => {
    const newMatrix = cloneDeep(matrix);
    tetrimino.forEach(({ y, x, z }) => {
      newMatrix[y][x][z] = type;
    });
    triggerRef.current = 'piece-fix';
    setMatrix(newMatrix);
  };

  /**
   * Checks for completed lines in the board, physically deletes them and
   * returns their coordinates.
   */
  const deleteLines = () => {
    const completedLines = checkCompletedLines(board);
    if (completedLines.length > 0) {
      const newMatrix = removeCompletedLines(matrix)(completedLines);
      triggerRef.current = 'line-clear';
      setMatrix(newMatrix);
    }
    return completedLines;
  };

  useEffect(() => {
    const completedLines = checkCompletedLines(board);
    match(triggerRef.current)
      .with('piece-fix', () => {
        effect.onPieceFixed(completedLines);
      })
      .with('line-clear', () => {
        effect.onLinesDeleted(completedLines);
      })
      .otherwise(noop);
  }, [matrix]);

  return {
    board,
    fixPiece,
    deleteLines,
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
  const newMatriz = cloneDeep(matrix);
  const deleteBlock = deleteBlockOnMatrix(newMatriz);
  const blockToDelete = linesToBlocks(lines);
  blockToDelete.forEach(deleteBlock);
  return newMatriz;
};
