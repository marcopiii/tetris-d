import {COLS, ROWS} from "./params.js";
import type {Piece} from "./Piece.js";

export class Board {
  constructor() {
    this._grid = Array(ROWS).fill().map(() => Array(COLS).fill(null));
  }

  blockAt(row: number, col: number) {
    return this._grid[row][col];
  }

  forEachBlock(callback: (color: string | undefined, row: number, col: number) => void) {
    this._grid.forEach((row,i) =>
        row.forEach((col, k) =>
            callback(col, i, k)
        )
    );
  }

  fixPiece(piece: Piece) {
    for (let shapeY = 0; shapeY < piece.shape.length; shapeY++) {
      for (let shapeX = 0; shapeX < piece.shape[shapeY].length; shapeX++) {
        if (piece.shape[shapeY][shapeX] !== 0) {
          this._grid[piece.position.y + shapeY][piece.position.x + shapeX] = piece.color;
        }
      }
    }
  }

  checkRows() {
    const bottomRowIndex = this._grid.length - 1;
    for (let row = bottomRowIndex; row >= 0; row--) {
      if (this._grid[row].every(cell => cell !== null)) {
        this._grid.splice(row, 1);
        this._grid.unshift(Array(COLS).fill(null));
        row++; // Recheck the same row after clearing
      }
    }
  }

  clean() {
    this._grid.forEach(row => row.fill(null));
  }

}
