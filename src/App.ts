import { GamepadManager } from './gamepad';
import { KeyboardManager } from './keyboard';
import { RenderManager } from './render';
import { MainMenuScenario, PvEScenario } from './scenario';

type ScenarioState =
  | {
      scenario: 'main-menu';
      state: MainMenuScenario;
    }
  | {
      scenario: 'pve-game';
      state: PvEScenario;
    };

export class App {
  private readonly _renderManager: RenderManager;

  private readonly _keyboardManager: KeyboardManager;
  private readonly _gamepadP1: GamepadManager;

  private _scenario!: ScenarioState;

  constructor(container: HTMLElement) {
    this._renderManager = new RenderManager(container);

    this._keyboardManager = new KeyboardManager();
    this._gamepadP1 = new GamepadManager(0);

    this.mainMenu();
    this.animate();
  }

  private mainMenu = () => {
    this._scenario = {
      scenario: 'main-menu',
      state: new MainMenuScenario(
        this._renderManager.scene,
        this._renderManager.camera,
        this._renderManager.tween,
        this._keyboardManager,
        this._gamepadP1,
        {
          onPvE: this.startPvE,
        },
      ),
    };
  };

  private startPvE = () => {
    this._scenario = {
      scenario: 'pve-game',
      state: new PvEScenario(
        this._renderManager.scene,
        this._renderManager.camera,
        this._renderManager.tween,
        this._keyboardManager,
        this._gamepadP1,
      ),
    };
  };

  private animate = () => {
    requestAnimationFrame(this.animate);
    this._renderManager.tween.update();
    this._renderManager.render();
    this._gamepadP1.poll();
  };
}
