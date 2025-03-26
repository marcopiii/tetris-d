import {Clock} from "./gameplay/Clock";
import {Progress} from "./gameplay/Progress";
import {Game} from "./gameplay/Game.js";
import {SceneManager} from "./scene/SceneManager.js";
import {CameraManager} from "./CameraManager.js";
import {GamepadManager} from "./GamepadManager.js";
import * as THREE from "three";
import {EffectComposer, RenderPass, UnrealBloomPass} from "three/addons";


const ctnr = document.getElementById('scene-container');

const clock = new Clock(processGameFrame);
const progress = new Progress();
const game = new Game();

const sceneManager = new SceneManager();
const cameraManager = new CameraManager(ctnr);
const gamepadManager = new GamepadManager(controllerHandler)

const renderer = new THREE.WebGLRenderer();
renderer.setSize(ctnr.clientWidth, ctnr.clientHeight);
ctnr.appendChild(renderer.domElement);

const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(sceneManager.scene, cameraManager.camera);
composer.addPass(renderPass);

// Initialize bloom pass
const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(ctnr.clientWidth, ctnr.clientHeight),
    0.5,
    0.1,
    0.85
);
composer.addPass(bloomPass);

// renderer.setAnimationLoop(() => {
//     cameraManager.tween.update();
//     renderer.render(sceneManager.scene, cameraManager.camera);
//     gamepadManager.poll();
// });

function animate() {
    requestAnimationFrame(animate);
    composer.render();
    cameraManager.tween.update();
    gamepadManager.poll();
}

function processGameFrame() {
    const [lineClear, gameOver] = game.tick();
    progress.add(lineClear);
    sceneManager.update(game.board, game.piece, progress.score, progress.level);
    if (gameOver) {
        clock.toggle();
        alert('Game Over');
        sceneManager.reset()
    }
}

function onStart() {
    game.reset();
    progress.reset();
    clock.start();
}

function commandHandler(command: "rotateL" | "rotateR" | "shiftL" | "shiftR" | "shiftF" | "shiftB" | "hardDrop") {
    if (!clock.isRunning)
        return;
    const sceneNeedsUpdate = game.tryMove(command);
    if (sceneNeedsUpdate)
        sceneManager.update(game.board, game.piece, progress.score, progress.level);
}

function keyboardHandler(event) {
    if (event.type === 'keydown') {
        if (event.key === 'ArrowLeft')
            event.shiftKey ? commandHandler('rotateL') : commandHandler('shiftL');
        if (event.key === 'ArrowRight')
            event.shiftKey ? commandHandler('rotateR') : commandHandler('shiftR');
        if (event.key === 'ArrowDown') commandHandler('shiftF');
        if (event.key === 'ArrowUp') commandHandler('shiftB');
        if (event.key === ' ') commandHandler('hardDrop');
        if (event.key === 'q') cameraManager.move('x-plane');
        if (event.key === 'e') cameraManager.move('z-plane');
        if (event.key === 'p') clock.toggle();
    }
    if (event.type === 'keyup') {
        if (event.key === 'q' || event.key === 'e') cameraManager.move("isometric");
    }
}

function controllerHandler(
    event: "press" | "release",
    btn: "start" | "padR" | "padL" | "padU" | "padD" | "X" | "B" | "A" | "LT" | "RT"
) {
    if (event === "press") {
        if (btn === "start") clock.toggle();
        if (btn === "padL") commandHandler('shiftL');
        if (btn === "padR") commandHandler('shiftR');
        if (btn === "padD") commandHandler('shiftF');
        if (btn === "padU") commandHandler('shiftB');
        if (btn === "X") commandHandler('rotateL');
        if (btn === "B") commandHandler('rotateR');
        if (btn === "A") commandHandler('hardDrop');
        if (btn === "LT") cameraManager.move('x-plane');
        if (btn === "RT") cameraManager.move('z-plane');
    }
    if (event === "release") {
        if (btn === "LT" || btn === "RT") cameraManager.move("isometric");
    }
}

document.getElementById('start-btn').addEventListener('click', onStart);

document.addEventListener('keydown', keyboardHandler);
document.addEventListener('keyup', keyboardHandler);

window.addEventListener("gamepadconnected", e => gamepadManager.connect(e.gamepad));
window.addEventListener("gamepaddisconnected", () => gamepadManager.disconnect());

animate();