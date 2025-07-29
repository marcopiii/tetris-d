import React from 'react';
import { COLS, ROWS } from '../params';
import { LineCoord } from '../scenario/game/types';
import { Name as Tetrimino } from '../tetrimino';
import { copy } from '../utils';
import type { Name as TetriminoType } from '../tetrimino/types';

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
            xRow.map((type, z) => (type ? callback(type, y, x, z) : undefined)),
          ),
        )
        .filter((i): i is T => !!i),
    [matrix],
  );

  const fixPiece = React.useCallback(
    (
      pieceType: TetriminoType,
      pieceMatrixIterator: <T>(
        callback: (y: number, x: number, z: number) => T,
      ) => T[],
    ) => {
      const newMatrix = copy(matrix);
      pieceMatrixIterator((y, x, z) => {
        newMatrix[y][x][z] = pieceType;
      });
    },
    [matrix],
  );

  /** Marks the completed line for deletion. Return the coordinates of the lines */
  const checkLines = React.useCallback((): LineCoord[] => {
    const newMatrix = copy(matrix);

    const checkZAxisRow = (y: number, x: number) => {
      for (let z = 0; z < COLS; z++) {
        if (!newMatrix[y][x][z]) return false;
      }
      return true;
    };
    const checkXAxisRow = (y: number, z: number) => {
      for (let x = 0; x < COLS; x++) {
        if (!newMatrix[y][x][z]) return false;
      }
      return true;
    };

    const clearedLines: LineCoord[] = [];
    for (let y = 0; y < ROWS; y++) {
      for (let z = 0; z < COLS; z++) {
        if (checkXAxisRow(y, z)) {
          for (let x = 0; x < COLS; x++) {
            newMatrix[y][x][z] = 'DELETE';
          }
          clearedLines.push({ y, z });
        }
      }
      for (let x = 0; x < COLS; x++) {
        if (checkZAxisRow(y, x)) {
          for (let z = 0; z < COLS; z++) {
            newMatrix[y][x][z] = 'DELETE';
          }
          clearedLines.push({ y, x });
        }
      }
    }

    setMatrix(newMatrix);
    return clearedLines;
  }, [matrix]);

  const clearLines = React.useCallback(() => {
    const newMatrix = copy(matrix);
    let clearedLines = false;
    for (let x = 0; x < COLS; x++) {
      for (let z = 0; z < COLS; z++) {
        let y = ROWS - 1;
        while (y >= 0) {
          if (newMatrix[y][x][z] === 'DELETE') {
            // actually delete the block
            for (let dy = y; dy > 0; dy--) {
              newMatrix[dy][x][z] = newMatrix[dy - 1][x][z];
            }
            newMatrix[0][x][z] = null;
            clearedLines = true;
          } else {
            y--;
          }
        }
      }
    }
    setMatrix(newMatrix);
    return clearedLines;
  }, [matrix]);

  return {
    flatMapBlocks,
    fixPiece,
    checkLines,
    clearLines,
  };
}
