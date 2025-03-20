import {COLS, ROWS} from "./params.js";
import type {Piece} from "./Piece.js";
import type {Board} from "./Board";

export function detectCollision(board: Board, piece: Piece) {
  for (let shapeY = 0; shapeY < piece.shape.length; shapeY++) {
    for (let shapeX = 0; shapeX < piece.shape[shapeY].length; shapeX++) {
      if (piece.shape[shapeY][shapeX] !== 0) {
        if (
          piece.position.y + shapeY >= ROWS ||
          piece.position.x + shapeX < 0 ||
          piece.position.x + shapeX >= COLS ||
          board.blockAt(piece.position.y + shapeY, piece.position.x + shapeX) !== null
        ) {
          return true;
        }
      }
    }
  }
  return false;
}
