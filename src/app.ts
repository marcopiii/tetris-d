import {
  Button as GamepadButton,
  Event as GamepadEvent,
  GamepadManager,
} from './gamepad';
import { Game, Clock, Progress } from './gameplay';
import { PlayerManager } from './player';
import { RenderManager } from './render';
import { SceneManager } from './scene';
import { CameraManager } from './camera';
import type { GameAction, CameraAction } from './action';
import './style.css';

const container = document.getElementById('scene-container')!;

const clock = new Clock(processGameFrame);
const game = new Game(onNewPiece);

const sceneManager = new SceneManager();
const cameraManager = new CameraManager(container);
const renderManager = new RenderManager(
  container,
  sceneManager.scene,
  cameraManager.camera,
);

const playerManager = new PlayerManager("P1", "P2");
const progressP1 = new Progress();
const progressP2 = new Progress();
const gamepadP1 = new GamepadManager(0, controllerHandler);
const gamepadP2 = new GamepadManager(1, controllerHandler);

function animate() {
  requestAnimationFrame(animate);
  cameraManager.tween.update();
  renderManager.render();
  gamepadP1.poll();
  gamepadP2.poll();
}

function processGameFrame() {
  const [lineClearP1, lineClearP2, gameOver] = game.tick();
  progressP1.add(lineClearP1);
  progressP2.add(lineClearP2);
  sceneManager.update(game, progressP1, progressP2, playerManager.players);
  if (gameOver) {
    clock.toggle();
    alert('Game Over');
    sceneManager.reset();
  }
}

function onNewPiece() {
  playerManager.switchPlayer();
  gamepadP1.active = playerManager.activePlayer === 'P1';
  gamepadP2.active = playerManager.activePlayer === 'P2';
}

function onStart() {
  game.reset();
  progressP1.reset();
  clock.start();
}

function commandHandler(command: GameAction) {
  if (!clock.isRunning) return;
  const sceneNeedsUpdate = game.tryMove(command);
  if (sceneNeedsUpdate)
    sceneManager.update(
      game,
      progressP1,
      progressP2,
      playerManager.players,
    );
}

function cuttingHandler(
  action: Extract<CameraAction, { type: 'cut' | 'uncut' }>,
) {
  sceneManager.cutter = {
    below: action.side === 'below' ? action.type === 'cut' : undefined,
    above: action.side === 'above' ? action.type === 'cut' : undefined,
  };
  sceneManager.update(game, progressP1, progressP2, playerManager.players);
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

animate();
