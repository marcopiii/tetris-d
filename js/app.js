import {Game} from "./Game.js";
import {Clock} from "./Clock.js";
import {renderScene} from "./render/renderScene.js";

const contexts = [
    document.getElementById("game-board-1").getContext('2d'),
    document.getElementById("game-board-2").getContext('2d'),
    document.getElementById("game-board-3").getContext('2d')
];

const game = new Game();
const clock = new Clock();

function frame() {
    const gameOver = game.tick();
    renderScene(game, contexts);
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
    renderScene(game, contexts);
}

function onRotate(direction: "left" | "right") {
    game.movePiece("rotate", direction);
    renderScene(game, contexts);
}

function onJump(direction: "left" | "right") {
    game.movePiece("jump", direction);
    renderScene(game, contexts);
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


