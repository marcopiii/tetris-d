import {renderBlock} from "./renderBlock.js";
import type {Board} from "../Board.js";

export function renderBoard(ctx, board: Board) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  board.forEachBlock((color, row, col) => {
    if (color !== null) {
      renderBlock(ctx, col, row, color);
    }
  })

}
