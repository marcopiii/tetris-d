import {renderBlock} from "./renderBlock.js";

export function renderPlane(ctx, plane: Array<Array<string | null>>) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  plane.forEach((row,y) =>
      row.forEach((color, x) =>
          renderBlock(ctx, x, y, color)
      )
  );

}
