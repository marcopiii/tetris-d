import {
  Button as GamepadButton,
  Event as GamepadEvent,
  GamepadManager,
} from './gamepad';
import { Game, Clock, Progress } from './gameplay';
import { RenderManager } from './render';
import { SceneManager } from './scene';
import { CameraManager } from './camera';
import type { GameAction, CameraAction } from './action';
import './style.css';

const container = document.getElementById('scene-container')!;

const clock = new Clock(processGameFrame);
const progressP1 = new Progress();
const progressP2 = new Progress();
const game = new Game();

const sceneManager = new SceneManager();
const cameraManager = new CameraManager(container);
const renderManager = new RenderManager(
  container,
  sceneManager.scene,
  cameraManager.camera,
);

const gamepadManager = new GamepadManager(controllerHandler);

function animate() {
  requestAnimationFrame(animate);
  cameraManager.tween.update();
  renderManager.render();
  gamepadManager.poll();
}

function processGameFrame() {
  const [lineClearP1, lineClearP2, gameOver] = game.tick();
  progressP1.add(lineClearP1);
  progressP2.add(lineClearP2);
  sceneManager.update(game, progressP1);
  if (gameOver) {
    clock.toggle();
    alert('Game Over');
    sceneManager.reset();
  }
}

function onStart() {
  game.reset();
  progressP1.reset();
  clock.start();
}

function commandHandler(command: GameAction) {
  if (!clock.isRunning) return;
  const sceneNeedsUpdate = game.tryMove(command);
  if (sceneNeedsUpdate) sceneManager.update(game, progressP1);
}

function cuttingHandler(
  action: Extract<CameraAction, { type: 'cut' | 'uncut' }>,
) {
  sceneManager.cutter = {
    below: action.side === 'below' ? action.type === 'cut' : undefined,
    above: action.side === 'above' ? action.type === 'cut' : undefined,
  };
  sceneManager.update(game, progressP1);
}

function keyboardHandler(event: KeyboardEvent) {
  if (event.type === 'keydown') {
    if (event.key === 'Enter') onStart();
    if (event.key === 'w') commandHandler('hold');
    if (event.key === 'ArrowLeft')
      event.shiftKey ? commandHandler('rotateL') : commandHandler('shiftL');
    if (event.key === 'ArrowRight')
      event.shiftKey ? commandHandler('rotateR') : commandHandler('shiftR');
    if (event.key === 'ArrowDown') commandHandler('shiftF');
    if (event.key === 'ArrowUp') commandHandler('shiftB');
    if (event.key === ' ') commandHandler('hardDrop');
    if (event.key === 'q')
      cameraManager.move({ type: 'move', direction: 'left' });
    if (event.key === 'e')
      cameraManager.move({ type: 'move', direction: 'right' });
    if (event.key === 'a') cuttingHandler({ type: 'cut', side: 'below' });
    if (event.key === 'd') cuttingHandler({ type: 'cut', side: 'above' });
    if (event.key === 'p') clock.toggle();
  }
  if (event.type === 'keyup') {
    if (event.key === 'a') cuttingHandler({ type: 'uncut', side: 'below' });
    if (event.key === 'd') cuttingHandler({ type: 'uncut', side: 'above' });
  }
}

function controllerHandler(event: GamepadEvent, btn: GamepadButton) {
  if (event === 'press') {
    if (btn === 'start') clock.toggle();
    if (btn === 'select') onStart();
    if (btn === 'padL') commandHandler('shiftL');
    if (btn === 'padR') commandHandler('shiftR');
    if (btn === 'padD') commandHandler('shiftF');
    if (btn === 'padU') commandHandler('shiftB');
    if (btn === 'X') commandHandler('rotateL');
    if (btn === 'B') commandHandler('rotateR');
    if (btn === 'A') commandHandler('hardDrop');
    if (btn === 'Y') commandHandler('hold');
    if (btn === 'LT') cameraManager.move({ type: 'move', direction: 'left' });
    if (btn === 'RT') cameraManager.move({ type: 'move', direction: 'right' });
    if (btn === 'LB') cuttingHandler({ type: 'cut', side: 'below' });
    if (btn === 'RB') cuttingHandler({ type: 'cut', side: 'above' });
  }
  if (event === 'release') {
    if (btn === 'LB') cuttingHandler({ type: 'uncut', side: 'below' });
    if (btn === 'RB') cuttingHandler({ type: 'uncut', side: 'above' });
  }
}

document.addEventListener('keydown', keyboardHandler);
document.addEventListener('keyup', keyboardHandler);

animate();
