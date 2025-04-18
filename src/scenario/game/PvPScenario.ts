import { Group as TWEENGroup } from '@tweenjs/tween.js';
import * as THREE from 'three';
import { GameCamera } from './GameCamera';
import { GamepadManager } from '../../gamepad';
import { Clock } from './Clock';
import { Game } from './Game';
import { Progress } from './Progress';
import { PlayerManager } from './PlayerManager';
import { PvPScene } from './PvPScene';
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

export class PvPScenario extends GameScenario {
  private readonly _game: Game;
  private readonly _clock: Clock;
  private readonly _playerManager: PlayerManager;
  private readonly _progressP1: Progress;
  private readonly _progressP2: Progress;

  private readonly _sceneManager: PvPScene;
  private readonly _cameraManager: GameCamera;

  private readonly _gamepadP1: GamepadManager;
  private readonly _gamepadP2: GamepadManager;

  constructor(
    scene: THREE.Scene,
    camera: THREE.Camera,
    tween: TWEENGroup,
    gamepadP1: GamepadManager,
    gamepadP2: GamepadManager,
  ) {
    super();

    this._sceneManager = new PvPScene(scene);
    this._cameraManager = new GameCamera(camera, tween);

    this._gamepadP1 = gamepadP1;
    this._gamepadP2 = gamepadP2;
    this._gamepadP1.handler = this.controllerHandler;
    this._gamepadP2.handler = this.controllerHandler;

    this._clock = new Clock(this.processGameFrame);
    this._game = new Game(this.onNewPiece);
    this._playerManager = new PlayerManager('p1', 'p2');
    this._progressP1 = new Progress();
    this._progressP2 = new Progress();

    this._sceneManager.update(
      this._game,
      this._progressP1,
      this._progressP2,
      this._playerManager.players,
      this._cameraManager.position,
    );
    this._clock.start();
  }

  private processGameFrame = () => {
    const [lineClearP1, lineClearP2, gameOver] = this._game.tick();
    this._progressP1.add(lineClearP1);
    this._progressP2.add(lineClearP2);
    this._sceneManager.update(
      this._game,
      this._progressP1,
      this._progressP2,
      this._playerManager.players,
      this._cameraManager.position,
    );
    if (gameOver) {
      this._clock.toggle();
      alert('Game Over');
      // todo: return to main menu
    }
  };

  private onNewPiece = () => {
    this._playerManager.switchPlayer();
    this._gamepadP1.active = this._playerManager.activePlayer === 'P1';
    this._gamepadP2.active = this._playerManager.activePlayer === 'P2';
    this._clock.level =
      this._playerManager.activePlayer === 'P1'
        ? this._progressP1.level
        : this._progressP2.level;
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
        this._progressP1,
        this._progressP2,
        this._playerManager.players,
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
      this._progressP1,
      this._progressP2,
      this._playerManager.players,
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
      this._progressP1,
      this._progressP2,
      this._playerManager.players,
      this._cameraManager.position,
    );
  };

  protected clockCommandHandler = (action: 'toggle') => {
    this._clock.toggle();
  };
}
