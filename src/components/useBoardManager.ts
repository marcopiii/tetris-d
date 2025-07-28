import React from 'react';
import { COLS, ROWS } from '../params';
import type { Piece } from '../scenario/game/Piece';
import { LineCoord } from '../scenario/game/types';
import { Name as Tetrimino } from '../tetrimino';
import { copy } from '../utils';

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

  function blockAt(y: number, x: number, z: number): BoardBlock | null {
    return matrix[y][x][z];
  }

  function fixPiece(piece: Piece) {
    const newMatrix = copy(matrix);
    piece.forEachBlock((y, x, z) => {
      newMatrix[y][x][z] = piece.type;
    });
    setMatrix(newMatrix);
  }

  /** Marks the completed line for deletion. Return the coordinates of the lines */
  function checkLines(): LineCoord[] {
    const checkZAxisRow = (y: number, x: number) => {
      for (let z = 0; z < COLS; z++) {
        if (!matrix[y][x][z]) return false;
      }
      return true;
    };
    const checkXAxisRow = (y: number, z: number) => {
      for (let x = 0; x < COLS; x++) {
        if (!matrix[y][x][z]) return false;
      }
      return true;
    };

    const clearedLines: LineCoord[] = [];
    const newMatrix = copy(matrix);
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
  }

  const deleteBlock =
    (matrix: (BoardBlock | null)[][][]) =>
    (y: number, x: number, z: number) => {
      for (let dy = y; dy > 0; dy--) {
        matrix[dy][x][z] = matrix[dy - 1][x][z];
      }
      matrix[0][x][z] = null;
    };

  /** Deletes the marked lines and returns true if any line was cleared */
  function clearLines() {
    let clearedLines = false;
    const newMatrix = copy(matrix);

    for (let x = 0; x < COLS; x++) {
      for (let z = 0; z < COLS; z++) {
        let y = ROWS - 1;
        while (y >= 0) {
          if (matrix[y][x][z] === 'DELETE') {
            deleteBlock(newMatrix)(y, x, z);
            clearedLines = true;
          } else {
            y--;
          }
        }
      }
    }
    setMatrix(newMatrix);
    return clearedLines;
  }

  return {
    matrix,
    blockAt,
    fixPiece,
    checkLines,
    clearLines,
  };
}
