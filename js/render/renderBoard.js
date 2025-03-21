import {COLS} from "../params";
import {Game} from "../models/Game";
import {renderPlane} from "./renderPlane";

export function renderBoard(game: Game, ctx_x, ctx_y) {
    Array(COLS).fill().forEach((_, x) => {
        const plane = game.board.plane("x", x)
        const ctx = ctx_x[x]
        renderPlane(ctx, plane)
    })
    Array(COLS).fill().forEach((_, y) => {
        const plane = game.board.plane("y", y)
        const ctx = ctx_y[y]
        renderPlane(ctx, plane)
    })
}