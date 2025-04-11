import { CameraManager } from './camera';
import { GamepadManager } from './gamepad';
import { RenderManager } from './render';
import { MainMenuScenario, PvPGameScenario } from './scenario';
import { SceneManager } from './scene';

type ScenarioState =
  | {
      scenario: 'main-menu';
      state: MainMenuScenario;
    }
  | {
      scenario: 'pvp-game';
      state: PvPGameScenario;
    };

export class App {
  private readonly _sceneManager: SceneManager;
  private readonly _cameraManager: CameraManager;
  private readonly _renderManager: RenderManager;

  private readonly _gamepadP1: GamepadManager;
  private readonly _gamepadP2: GamepadManager;

  private _scenario!: ScenarioState;

  constructor(container: HTMLElement) {
    this._sceneManager = new SceneManager();
    this._cameraManager = new CameraManager(container);
    this._renderManager = new RenderManager(
      container,
      this._sceneManager.scene,
      this._cameraManager.camera,
    );

    this._gamepadP1 = new GamepadManager(0);
    this._gamepadP2 = new GamepadManager(1);

    this.onMainMenu();

    this.animate();
  }

  private onStartGame = () => {
    this._scenario = {
      scenario: 'pvp-game',
      state: new PvPGameScenario(
        this._sceneManager,
        this._cameraManager,
        this._gamepadP1,
        this._gamepadP2,
      ),
    };
  };

  private onMainMenu = () => {
    this._scenario = {
      scenario: 'main-menu',
      state: new MainMenuScenario(
        this._sceneManager,
        this._cameraManager,
        this._gamepadP1,
        {
          onPvP: this.onStartGame,
          onExit: this.exit,
        },
      ),
    };
  };

  private exit = () => {
    window.location.href = 'https://www.google.com';
  };

  private animate = () => {
    requestAnimationFrame(this.animate);
    this._cameraManager.tween.update();
    this._renderManager.render();
    this._gamepadP1.poll();
    this._gamepadP2.poll();
  };
}
