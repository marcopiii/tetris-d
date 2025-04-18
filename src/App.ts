import { GamepadManager } from './gamepad';
import { KeyboardManager } from './keyboard/KeyboardManager';
import { RenderManager } from './render';
import { MainMenuScenario, PvPScenario, PvEScenario } from './scenario';

type ScenarioState =
  | {
      scenario: 'main-menu';
      state: MainMenuScenario;
    }
  | {
      scenario: 'pve-game';
      state: PvEScenario;
    }
  | {
      scenario: 'pvp-game';
      state: PvPScenario;
    };

export class App {
  private readonly _renderManager: RenderManager;

  private readonly _keyboardManager: KeyboardManager;
  private readonly _gamepadP1: GamepadManager;
  private readonly _gamepadP2: GamepadManager;

  private _scenario!: ScenarioState;

  constructor(container: HTMLElement) {
    this._renderManager = new RenderManager(container);

    this._keyboardManager = new KeyboardManager();
    this._gamepadP1 = new GamepadManager(0);
    this._gamepadP2 = new GamepadManager(1);

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
          onPvP: this.startPvP,
          onExit: this.exit,
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

  private startPvP = () => {
    this._scenario = {
      scenario: 'pvp-game',
      state: new PvPScenario(
        this._renderManager.scene,
        this._renderManager.camera,
        this._renderManager.tween,
        this._gamepadP1,
        this._gamepadP2,
      ),
    };
  };

  private exit = () => {
    window.location.href = 'https://www.google.com';
  };

  private animate = () => {
    requestAnimationFrame(this.animate);
    this._renderManager.tween.update();
    this._renderManager.render();
    this._gamepadP1.poll();
    this._gamepadP2.poll();
  };
}
