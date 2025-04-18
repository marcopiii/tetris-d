import { Group as TWEENGroup } from '@tweenjs/tween.js';
import * as THREE from 'three';
import { GameCamera } from './GameCamera';
import { GamepadManager } from '../../gamepad';
import { Clock } from './Clock';
import { Game } from './Game';
import { Progress } from './Progress';
import { PvEScene } from './PvEScene';
import { KeyboardManager } from '../../keyboard';
import { GameScenario } from './GameScenario';

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

export class PvEScenario extends GameScenario {
  private readonly _game: Game;
  private readonly _clock: Clock;
  private readonly _progress: Progress;

  private readonly _sceneManager: PvEScene;
  private readonly _cameraManager: GameCamera;

  private readonly _keyboard: KeyboardManager;
  private readonly _gamepad: GamepadManager;

  constructor(
    scene: THREE.Scene,
    camera: THREE.Camera,
    tween: TWEENGroup,
    keyboard: KeyboardManager,
    gamepad: GamepadManager,
  ) {
    super();
    this._sceneManager = new PvEScene(scene);
    this._cameraManager = new GameCamera(camera, tween);

    this._keyboard = keyboard;
    this._keyboard.handler = this.keyboardHandler;

    this._gamepad = gamepad;
    this._gamepad.handler = this.controllerHandler;

    this._clock = new Clock(this.processGameFrame);
    this._game = new Game(this.onNewPiece);
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

  protected gameCommandHandler = (command: GameAction) => {
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

  protected cameraCommandHandler = (
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

  protected cuttingCommandHandler = (
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

  protected clockCommandHandler = (action: 'toggle') => {
    this._clock.toggle();
  };
}
