import {Clock} from "./models/Clock";
import {Game} from "./models/Game.js";
import {SceneManager} from "./scene/SceneManager.js";
import {CameraManager} from "./CameraManager.js";
import {GamepadManager} from "./GamepadManager.js";
import * as THREE from "three";

const ctnr = document.getElementById('scene-container');

const clock = new Clock();
const game = new Game();
const sceneManager = new SceneManager();
const cameraManager = new CameraManager(ctnr);
const gamepadManager = new GamepadManager(
    btn => console.log("pressed", btn),
    btn => console.log("released", btn)
)

const renderer = new THREE.WebGLRenderer();
renderer.setSize(ctnr.clientWidth, ctnr.clientHeight);

ctnr.appendChild(renderer.domElement);

renderer.setAnimationLoop(() => {
    cameraManager.tween.update();
    renderer.render(sceneManager.scene, cameraManager.camera);
    gamepadManager.poll();
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
    console.log(event)
    let sceneNeedsUpdate = false;
    switch (event.type) {
        case 'keydown':
            switch (event.key) {
                case 'ArrowLeft':
                    sceneNeedsUpdate = event.shiftKey
                        ? game.tryMove("rotateL")
                        : game.tryMove('shiftL');
                    break;
                case 'ArrowRight':
                    sceneNeedsUpdate = event.shiftKey
                        ? game.tryMove("rotateR")
                        : game.tryMove('shiftR');
                    break;
                case 'ArrowDown':
                    sceneNeedsUpdate = game.tryMove('shiftF');
                    break;
                case 'ArrowUp':
                    sceneNeedsUpdate = game.tryMove('shiftB');
                    break;
                case ' ':
                    sceneNeedsUpdate = game.tryMove('hardDrop');
                    break;
                case 'q':
                    cameraManager.move("x-plane");
                    break;
                case 'e':
                    cameraManager.move("z-plane");
                    break;
            }
            break;
        case 'keyup':
            switch (event.key) {
                case 'q':
                case 'e':
                    cameraManager.move("isometric");
                    break;
            }
            break;
    }
    if (sceneNeedsUpdate) sceneManager.update(game.board, game.piece);
}

document.getElementById('start-btn').addEventListener('click', onStart);
document.getElementById('pause-btn').addEventListener('click', onPause);

document.addEventListener('keydown', controller);
document.addEventListener('keyup', controller);

window.addEventListener("gamepadconnected", e => gamepadManager.connect(e.gamepad));
window.addEventListener("gamepaddisconnected", () => gamepadManager.disconnect());
