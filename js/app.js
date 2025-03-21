import {Game} from "./models/Game.js";
import {SceneManager} from "./render/SceneManager.js";
import {render} from "./render/render.js";
import * as THREE from "three";

const ctnr = document.getElementById('scene-container');

const game = new Game();
const sceneManager = new SceneManager()

const camera = new THREE.PerspectiveCamera(75, ctnr.clientWidth / ctnr.clientHeight, 0.1, 1000);
camera.position.z = 20;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(ctnr.clientWidth, ctnr.clientHeight);
ctnr.appendChild(renderer.domElement);

function onStart() {
    game.reset();
    game.board.fixPiece(game.currentPiece);
    render(game.board, sceneManager);

    renderer.setAnimationLoop(() => {
        renderer.render(sceneManager.scene, camera)
    });
}

document.getElementById('start-btn').addEventListener('click', onStart);