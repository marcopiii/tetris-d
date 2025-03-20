// @flow
import {Game} from "./Game.js";
import {Clock} from "./Clock.js";
import {renderBoard} from "./render/renderBoard.js";
import {renderPiece} from "./render/renderPiece.js";

const contexts = [
    document.getElementById("game-board-1").getContext('2d'),
    document.getElementById("game-board-2").getContext('2d'),
    document.getElementById("game-board-3").getContext('2d')
];

const game = new Game();
const clock = new Clock();

function renderFrame(game: Game, ctxs) {
    game.boards.forEach((board, i) => renderBoard(ctxs[i], board));
    const k = game.activeBoardIndex;
    renderPiece(ctxs[k], game.currentPiece);
}

function frame() {
    const gameOver = game.tick();
    renderFrame(game, contexts);
    if (gameOver) {
        clock.pause();
        alert('Game Over');
    }
}

function onStart() {
    game.reset();
    clock.resume(frame);
}

function onPause() {
    clock.pause();
}

function onMove(direction: "left" | "right") {
    game.movePiece("shift", direction);
    renderFrame(game, contexts);
}

function onRotate(direction: "left" | "right") {
    game.movePiece("rotate", direction);
    renderFrame(game, contexts);
}

function onJump(direction: "left" | "right") {
    game.movePiece("jump", direction);
    renderFrame(game, contexts);
}

function controlsHandler(event) {
    switch (event.key) {
        case 'ArrowUp':
            onRotate("right");
            break;
        case 'ArrowRight':
            event.shiftKey ? onJump("right") : onMove("right");
            break;
        case 'ArrowLeft':
            event.shiftKey ? onJump("left") : onMove("left");
            break;
        case 'ArrowDown':
            frame();
            break;
    }
}

document.getElementById('start-btn').addEventListener('click', onStart);
document.getElementById('pause-btn').addEventListener('click', onPause);
document.addEventListener('keydown', controlsHandler);


