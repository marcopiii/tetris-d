import {Clock} from "./models/Clock";
import {Game} from "./models/Game.js";
import {SceneManager} from "./scene/SceneManager.js";
import * as THREE from "three";

const ctnr = document.getElementById('scene-container');

const clock = new Clock();
const game = new Game();
const sceneManager = new SceneManager()

const aspect = ctnr.clientWidth / ctnr.clientHeight
const frustumSize = 25;
const camera = new THREE.OrthographicCamera(
    frustumSize * aspect / - 2,
    frustumSize * aspect / 2,
    frustumSize / 2,
    frustumSize / - 2
);
camera.position.z = 10;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(ctnr.clientWidth, ctnr.clientHeight);

ctnr.appendChild(renderer.domElement);

renderer.setAnimationLoop(() => {
    renderer.render(sceneManager.scene, camera)
});

function processGameFrame() {
    const gameOver = game.tick();
    sceneManager.update(game.board, game.piece);
    if (gameOver) {
        clock.pause();
        alert('Game Over');
        sceneManager.reset()
    }
}

function onStart() {
    game.reset();
    clock.resume(processGameFrame);
}

function onResume() {
    clock.resume(processGameFrame);
    const pauseBtn = document.getElementById('pause-btn');
    pauseBtn.textContent = 'Pause';
    pauseBtn.removeEventListener('click', onResume);
    pauseBtn.addEventListener('click', onPause);
}

function onPause() {
    clock.pause();
    const pauseBtn = document.getElementById('pause-btn');
    pauseBtn.textContent = 'Resume';
    pauseBtn.removeEventListener('click', onPause);
    pauseBtn.addEventListener('click', onResume);
}

function controller(event) {
    let success;
    switch (event.key) {
        case 'ArrowLeft':
            success = event.shiftKey ? game.tryMove("rotateL") : game.tryMove('shiftL');
            break;
        case 'ArrowRight':
            success = event.shiftKey ? game.tryMove("rotateR") : game.tryMove('shiftR');
            break;
        case 'ArrowDown':
            success = event.shiftKey ? game.tryMove("twistL") : game.tryMove('shiftF');
            break;
        case 'ArrowUp':
            success = event.shiftKey ? game.tryMove("twistR") : game.tryMove('shiftB');
            break;
    }
    if (success) sceneManager.update(game.board, game.piece);
}

document.getElementById('start-btn').addEventListener('click', onStart);
document.getElementById('pause-btn').addEventListener('click', onPause);
document.addEventListener('keydown', controller);