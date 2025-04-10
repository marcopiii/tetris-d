import type { CameraAction, GameAction } from '../action';
import { CameraManager } from '../camera';
import {
  Button as GamepadButton,
  Event as GamepadEvent,
  GamepadManager,
} from '../gamepad';
import { Clock, Game, Progress } from '../gameplay';
import { PlayerManager } from '../player';
import { SceneManager } from '../scene';

export class PvPGameScenario {
  private readonly _game: Game;
  private readonly _clock: Clock;
  private readonly _playerManager: PlayerManager;
  private readonly _progressP1: Progress;
  private readonly _progressP2: Progress;

  private readonly _sceneManager: SceneManager;
  private readonly _cameraManager: CameraManager;

  private readonly _gamepadP1: GamepadManager;
  private readonly _gamepadP2: GamepadManager;

  constructor(
    sceneManager: SceneManager,
    cameraManager: CameraManager,
    gamepadP1: GamepadManager,
    gamepadP2: GamepadManager,
  ) {
    this._sceneManager = sceneManager;
    this._cameraManager = cameraManager;

    this._gamepadP1 = gamepadP1;
    this._gamepadP2 = gamepadP2;
    this._gamepadP1.handler = this.controllerHandler;
    this._gamepadP2.handler = this.controllerHandler;

    this._clock = new Clock(this.processGameFrame);
    this._game = new Game(this.onNewPiece);
    this._playerManager = new PlayerManager('P1', 'P2');
    this._progressP1 = new Progress();
    this._progressP2 = new Progress();

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
      this._sceneManager.reset();
    }
  }

  private onNewPiece = () => {
    this._playerManager.switchPlayer();
    this._gamepadP1.active = this._playerManager.activePlayer === 'P1';
    this._gamepadP2.active = this._playerManager.activePlayer === 'P2';
  }

  private gameCommandHandler = (command: GameAction) => {
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
  }

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
      this._progressP1,
      this._progressP2,
      this._playerManager.players,
      this._cameraManager.position,
    );
  }

  private cuttingCommandHandler = (
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
  }

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
  }
}
