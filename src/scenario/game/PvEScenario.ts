import { Group as TWEENGroup } from '@tweenjs/tween.js';
import * as THREE from 'three';
import { GameCamera } from './GameCamera';
import {
  Button as GamepadButton,
  Event as GamepadEvent,
  GamepadManager,
} from '../../gamepad';
import { Clock } from './Clock';
import { Game } from './Game';
import { Progress } from './Progress';
import { PlayerManager } from './PlayerManager';
import { PvEScene } from './PvEScene';

export type CameraAction =
  | {
      type: 'move';
      direction: 'left' | 'right';
    }
  | {
      type: 'cut';
      side: 'above' | 'below';
    }
  | {
      type: 'uncut';
      side: 'above' | 'below';
    };

type GameAction =
  | 'hold'
  | 'rotateL'
  | 'rotateR'
  | 'shiftL'
  | 'shiftR'
  | 'shiftF'
  | 'shiftB'
  | 'hardDrop';

export class PvEScenario {
  private readonly _game: Game;
  private readonly _clock: Clock;
  private readonly _playerManager: PlayerManager;
  private readonly _progress: Progress;

  private readonly _sceneManager: PvEScene;
  private readonly _cameraManager: GameCamera;

  private readonly _gamepad: GamepadManager;

  constructor(
    scene: THREE.Scene,
    camera: THREE.Camera,
    tween: TWEENGroup,
    gamepad: GamepadManager,
  ) {
    this._sceneManager = new PvEScene(scene);
    this._cameraManager = new GameCamera(camera, tween);

    this._gamepad = gamepad;
    this._gamepad.handler = this.controllerHandler;

    this._clock = new Clock(this.processGameFrame);
    this._game = new Game(this.onNewPiece);
    this._playerManager = new PlayerManager('p1', 'p2');
    this._progress = new Progress();

    this._sceneManager.update(
      this._game,
      this._progress,
      this._cameraManager.position,
    );
    this._clock.start();
  }

  private processGameFrame = () => {
    const [lineClearZ, lineClearX, gameOver] = this._game.tick();
    this._progress.add(lineClearZ + lineClearX);
    this._sceneManager.update(
      this._game,
      this._progress,
      this._cameraManager.position,
    );
    if (gameOver) {
      this._clock.toggle();
      alert('Game Over');
      // todo: return to main menu
    }
  };

  private onNewPiece = () => {
    this._clock.level = this._progress.level;
  };

  private gameCommandHandler = (command: GameAction) => {
    if (!this._clock.isRunning) return;
    const sceneNeedsUpdate = this._game.tryMove(
      command,
      this._cameraManager.position,
    );
    if (sceneNeedsUpdate)
      this._sceneManager.update(
        this._game,
        this._progress,
        this._cameraManager.position,
      );
  };

  private cameraCommandHandler = (
    action: Extract<CameraAction, { type: 'move' }>,
  ) => {
    switch (action.direction) {
      case 'left':
        this._cameraManager.move('left');
        break;
      case 'right':
        this._cameraManager.move('right');
        break;
    }
    this._sceneManager.update(
      this._game,
      this._progress,
      this._cameraManager.position,
    );
  };

  private cuttingCommandHandler = (
    action: Extract<CameraAction, { type: 'cut' | 'uncut' }>,
  ) => {
    this._sceneManager.cutter = {
      below: action.side === 'below' ? action.type === 'cut' : undefined,
      above: action.side === 'above' ? action.type === 'cut' : undefined,
    };
    this._sceneManager.update(
      this._game,
      this._progress,
      this._cameraManager.position,
    );
  };

  private controllerHandler = (event: GamepadEvent, btn: GamepadButton) => {
    if (event === 'press') {
      if (btn === 'start') this._clock.toggle();
      if (btn === 'padL') this.gameCommandHandler('shiftL');
      if (btn === 'padR') this.gameCommandHandler('shiftR');
      if (btn === 'padD') this.gameCommandHandler('shiftF');
      if (btn === 'padU') this.gameCommandHandler('shiftB');
      if (btn === 'X') this.gameCommandHandler('rotateL');
      if (btn === 'B') this.gameCommandHandler('rotateR');
      if (btn === 'A') this.gameCommandHandler('hardDrop');
      if (btn === 'Y') this.gameCommandHandler('hold');
      if (btn === 'LT')
        this.cameraCommandHandler({ type: 'move', direction: 'left' });
      if (btn === 'RT')
        this.cameraCommandHandler({ type: 'move', direction: 'right' });
      if (btn === 'LB')
        this.cuttingCommandHandler({ type: 'cut', side: 'below' });
      if (btn === 'RB')
        this.cuttingCommandHandler({ type: 'cut', side: 'above' });
    }
    if (event === 'release') {
      if (btn === 'LB')
        this.cuttingCommandHandler({ type: 'uncut', side: 'below' });
      if (btn === 'RB')
        this.cuttingCommandHandler({ type: 'uncut', side: 'above' });
    }
  };
}
