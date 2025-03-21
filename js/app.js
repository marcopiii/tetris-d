import {Game} from "./models/Game.js";
import {SceneManager} from "./render/SceneManager.js";
import * as THREE from "three";

const ctnr = document.getElementById('scene-container');

const game = new Game();
const sceneManager = new SceneManager()

const aspect = ctnr.clientWidth / ctnr.clientHeight
const frustumSize = 50;
const camera = new THREE.OrthographicCamera(
    frustumSize * aspect / - 2,
    frustumSize * aspect / 2,
    frustumSize / 2,
    frustumSize / - 2
);
camera.position.z = 20;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(ctnr.clientWidth, ctnr.clientHeight);

ctnr.appendChild(renderer.domElement);

function onStart() {
    game.reset();
    game.board.fixPiece(game.currentPiece);
    sceneManager.update(game.board);

    renderer.setAnimationLoop(() => {
        sceneManager.scene.rotation.y += 0.01;
        renderer.render(sceneManager.scene, camera)
    });
}

document.getElementById('start-btn').addEventListener('click', onStart);