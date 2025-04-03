import {Button as GamepadButton, Event as GamepadEvent, GamepadManager} from "./gamepad";
import {Game, Clock, Progress} from "./gameplay";
import {SceneManager} from "./scene/SceneManager.js";
import {CameraManager} from "./CameraManager.js";
import * as THREE from "three";
import {EffectComposer, RenderPass, UnrealBloomPass} from "three/addons";
import {Command} from "./types";

const container = document.getElementById('scene-container')!;

const clock = new Clock(processGameFrame);
const progress = new Progress();
const game = new Game();

const sceneManager = new SceneManager();
const cameraManager = new CameraManager(container);
const gamepadManager = new GamepadManager(controllerHandler)

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(container.clientWidth, container.clientHeight);
container.appendChild(renderer.domElement);

const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(sceneManager.scene, cameraManager.camera);
composer.addPass(renderPass);

const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(container.clientWidth, container.clientHeight),
    0.3,
    0.5,
    1
);
composer.addPass(bloomPass);

function animate() {
    requestAnimationFrame(animate);
    cameraManager.tween.update();
    composer.render();
    gamepadManager.poll();
}

function processGameFrame() {
    const [lineClear, gameOver] = game.tick();
    progress.add(lineClear);
    sceneManager.update(game, progress);
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

function commandHandler(command: Command) {
    if (!clock.isRunning)
        return;
    const sceneNeedsUpdate = game.tryMove(command);
    if (sceneNeedsUpdate)
        sceneManager.update(game, progress);
}

function cuttingHandler(action: "start" | "end", side: "below" | "above") {
    sceneManager.cutter = {
        below: side === 'below' ? action === 'start' : undefined,
        above: side === 'above' ? action === 'start' : undefined
    };
    sceneManager.update(game, progress);
}

function keyboardHandler(event: KeyboardEvent) {
    if (event.type === 'keydown') {
        if (event.key === 'w') commandHandler('hold')
        if (event.key === 'ArrowLeft')
            event.shiftKey ? commandHandler('rotateL') : commandHandler('shiftL');
        if (event.key === 'ArrowRight')
            event.shiftKey ? commandHandler('rotateR') : commandHandler('shiftR');
        if (event.key === 'ArrowDown') commandHandler('shiftF');
        if (event.key === 'ArrowUp') commandHandler('shiftB');
        if (event.key === ' ') commandHandler('hardDrop');
        if (event.key === 'q') cameraManager.move('left');
        if (event.key === 'e') cameraManager.move('right');
        if (event.key === 'a') cuttingHandler('start', 'below');
        if (event.key === 'd') cuttingHandler('start', 'above');
        if (event.key === 'p') clock.toggle();
    }
    if (event.type === 'keyup') {
        if (event.key === 'a') cuttingHandler('end', 'below');
        if (event.key === 'd') cuttingHandler('end', 'above');
    }
}

function controllerHandler(
    event: GamepadEvent,
    btn: GamepadButton
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
        if (btn === "Y") commandHandler('hold');
        if (btn === "LT") cameraManager.move('left');
        if (btn === "RT") cameraManager.move('right');
        if (btn === "LB") cuttingHandler('start', 'below');
        if (btn === "RB") cuttingHandler('start', 'above');
    }
    if (event === "release") {
        if (btn === "LB") cuttingHandler('end', 'below');
        if (btn === "RB") cuttingHandler('end', 'above');
    }
}

document.getElementById('start-btn')!.addEventListener('click', onStart);

document.addEventListener('keydown', keyboardHandler);
document.addEventListener('keyup', keyboardHandler);

window.addEventListener("gamepadconnected", e => gamepadManager.connect(e.gamepad));
window.addEventListener("gamepaddisconnected", () => gamepadManager.disconnect());

animate();