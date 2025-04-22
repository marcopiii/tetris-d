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
import { CameraCommand, CutCommand, GameplayCommand } from './commands';

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

    this._sceneManager.update(this._game, this._progress, this._cameraManager);
    this._clock.start();
  }

  private processGameFrame = () => {
    const [lineClearZ, lineClearX, gameOver] = this._game.tick();
    this._progress.add(lineClearZ + lineClearX);
    this._sceneManager.update(this._game, this._progress, this._cameraManager);
    if (gameOver) {
      this._clock.toggle();
      alert('Game Over');
      // todo: return to main menu
    }
  };

  private onNewPiece = () => {
    this._cameraManager.cut(
      { left: false, right: false },
      this._game.piece.plane,
    );
    this._clock.level = this._progress.level;
  };

  protected onGameplayCmd = (command: GameplayCommand) => {
    if (!this._clock.isRunning) return;
    const sceneNeedsUpdate = this._game.tryMove(command, this._cameraManager);
    if (sceneNeedsUpdate)
      this._sceneManager.update(
        this._game,
        this._progress,
        this._cameraManager,
      );
  };

  protected onCameraCmd = (command: CameraCommand) => {
    if (command === 'moveL')
      this._cameraManager.move('left', this._game.piece.plane);
    else if (command === 'moveR')
      this._cameraManager.move('right', this._game.piece.plane);

    this._sceneManager.update(this._game, this._progress, this._cameraManager);
  };

  protected onCutCmd = (command: CutCommand) => {
    this._cameraManager.cut(
      {
        left:
          command === 'cutLeft'
            ? true
            : command === 'uncutLeft'
              ? false
              : undefined,
        right:
          command === 'cutRight'
            ? true
            : command === 'uncutRight'
              ? false
              : undefined,
      },
      this._game.piece.plane,
    );
    this._sceneManager.update(this._game, this._progress, this._cameraManager);
  };

  protected onClockCmd = (command: 'toggle') => {
    this._clock.toggle();
  };
}
