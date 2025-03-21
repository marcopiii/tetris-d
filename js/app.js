import {Clock} from "./models/Clock";
import {Game} from "./models/Game.js";
import {SceneManager} from "./render/SceneManager.js";
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
    sceneManager.update(game.board);
    if (gameOver) {
        clock.pause();
        alert('Game Over');
    }
}

function onStart() {
    game.reset();
    clock.resume(processGameFrame);
}

document.getElementById('start-btn').addEventListener('click', onStart);