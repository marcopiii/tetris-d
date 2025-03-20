import {renderBlock} from "./renderBlock.js";

export function renderPiece(ctx, piece) {
  const {shape, color, position} = piece;
  for (let row = 0; row < shape.length; row++) {
    for (let col = 0; col < shape[row].length; col++) {
      if (shape[row][col] !== 0) {
        renderBlock(ctx, position.x + col, position.y + row, color);
      }
    }
  }
}
