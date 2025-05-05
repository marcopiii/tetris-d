import { GamepadManager } from './gamepad';
import { KeyboardManager } from './keyboard';
import { RenderManager } from './render';
import {
  MainMenuScenario,
  PvEScenario,
  ControlsMenuScenario,
} from './scenario';

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
      scenario: 'commands-menu';
      state: ControlsMenuScenario;
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

    this.goToMainMenu();
    this.animate();
  }

  private goToMainMenu = () => {
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
          onCommands: this.goToCommandsMenu,
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

  private goToCommandsMenu = () => {
    this._scenario = {
      scenario: 'commands-menu',
      state: new ControlsMenuScenario(
        this._renderManager.scene,
        this._renderManager.camera,
        this._renderManager.tween,
        this._keyboardManager,
        this._gamepadP1,
        {
          onBack: this.goToMainMenu,
        },
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
