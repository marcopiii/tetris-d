import {Game} from "./models/Game.js";
import {Clock} from "./models/Clock.js";
import {renderBoard} from "./render/renderBoard.js";

const ctx_y = [
    document.getElementById("plane-y0").getContext('2d'),
    document.getElementById("plane-y1").getContext('2d'),
    document.getElementById("plane-y2").getContext('2d'),
    document.getElementById("plane-y3").getContext('2d'),
    document.getElementById("plane-y4").getContext('2d'),
    document.getElementById("plane-y5").getContext('2d'),
    document.getElementById("plane-y6").getContext('2d'),
    document.getElementById("plane-y7").getContext('2d'),
    document.getElementById("plane-y8").getContext('2d'),
    document.getElementById("plane-y9").getContext('2d'),
];
const ctx_x = [
    document.getElementById("plane-x0").getContext('2d'),
    document.getElementById("plane-x1").getContext('2d'),
    document.getElementById("plane-x2").getContext('2d'),
    document.getElementById("plane-x3").getContext('2d'),
    document.getElementById("plane-x4").getContext('2d'),
    document.getElementById("plane-x5").getContext('2d'),
    document.getElementById("plane-x6").getContext('2d'),
    document.getElementById("plane-x7").getContext('2d'),
    document.getElementById("plane-x8").getContext('2d'),
    document.getElementById("plane-x9").getContext('2d')
];

const game = new Game();
const clock = new Clock();

function frame() {
    renderBoard(game, ctx_x, ctx_y);
}

function onStart() {
    game.reset();
    clock.resume(frame);
}

document.getElementById('start-btn').addEventListener('click', onStart);


