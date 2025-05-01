import { COLS, ROWS } from '../../params';
import type { Piece } from './Piece';
import { Name as Tetrimino } from '../../tetrimino';
import { LineCoord } from './types';

type BoardBlock = Tetrimino | 'DELETE';

export class Board {
  private readonly _matrix: (BoardBlock | null)[][][];

  constructor() {
    this._matrix = Array(ROWS)
      .fill(null)
      .map(() =>
        Array(COLS)
          .fill(null)
          .map(() => Array(COLS).fill(null)),
      );
  }

  blockAt(y: number, x: number, z: number): BoardBlock | null {
    return this._matrix[y][x][z];
  }

  /**
   * Applies the given callback to each existing block of the board.
   * @param callback
   */
  forEachBlock(
    callback: (type: BoardBlock, y: number, x: number, z: number) => void,
  ) {
    this._matrix.forEach((layer, y) =>
      layer.forEach((xRow, x) =>
        xRow.forEach((type, z) => {
          if (type) callback(type, y, x, z);
        }),
      ),
    );
  }

  /**
   * Inserts a piece into the board.
   * @param piece
   */
  fixPiece(piece: Piece) {
    piece.forEachBlock((y, x, z) => {
      this._matrix[y][x][z] = piece.type;
    });
  }

  private deleteBlock(y: number, x: number, z: number) {
    for (let dy = y; dy > 0; dy--) {
      this._matrix[dy][x][z] = this._matrix[dy - 1][x][z];
    }
    this._matrix[0][x][z] = null;
  }

  /** Marks the completed line for deletion. Return the coordinates of the lines */
  checkLines(): LineCoord[] {
    const checkZAxisRow = (y: number, x: number) => {
      for (let z = 0; z < COLS; z++) {
        if (!this._matrix[y][x][z]) return false;
      }
      return true;
    };
    const checkXAxisRow = (y: number, z: number) => {
      for (let x = 0; x < COLS; x++) {
        if (!this._matrix[y][x][z]) return false;
      }
      return true;
    };

    const clearedLines: LineCoord[] = [];
    for (let y = 0; y < ROWS; y++) {
      for (let z = 0; z < COLS; z++) {
        if (checkXAxisRow(y, z)) {
          for (let x = 0; x < COLS; x++) {
            this._matrix[y][x][z] = 'DELETE';
          }
          clearedLines.push({ y, z });
        }
      }
      for (let x = 0; x < COLS; x++) {
        if (checkZAxisRow(y, x)) {
          for (let z = 0; z < COLS; z++) {
            this._matrix[y][x][z] = 'DELETE';
          }
          clearedLines.push({ y, x });
        }
      }
    }
    return clearedLines;
  }

  /** Deletes the marked lines and returns true if any line was cleared */
  clearLines() {
    let clearedLines = false;
    for (let x = 0; x < COLS; x++) {
      for (let z = 0; z < COLS; z++) {
        let y = ROWS - 1;
        while (y >= 0) {
          if (this._matrix[y][x][z] === 'DELETE') {
            this.deleteBlock(y, x, z);
            clearedLines = true;
          } else {
            y--;
          }
        }
      }
    }
    return clearedLines;
  }

}
