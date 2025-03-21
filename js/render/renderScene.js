import {Game} from "../models/Game";
import {renderBoard} from "./renderBoard";
import {renderPiece} from "./renderPiece";

export function renderScene(game: Game, ctxs) {
    const k = game.activeBoardIndex;
    game.boards.forEach((board, i) => renderBoard(ctxs[i], board));
    game.boards.forEach((board, i) => renderPiece(ctxs[i], game.currentPiece, i !== k));
}