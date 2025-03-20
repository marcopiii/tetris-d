import {renderBlock, renderShadow} from "./renderBlock.js";
import type {Piece} from "../Piece";

export function renderPiece(ctx, piece: Piece, shadow = false) {
  const {shape, color, position} = piece;
  for (let row = 0; row < shape.length; row++) {
    for (let col = 0; col < shape[row].length; col++) {
      if (shape[row][col] !== 0) {
        shadow
            ? renderShadow(ctx, position.x + col, position.y + row, color)
            : renderBlock(ctx, position.x + col, position.y + row, color);
      }
    }
  }
}
