import { GamepadManager } from './gamepad';
import { RenderManager } from './render';
import { MainMenuScenario, PvPGameScenario } from './scenario';

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
  private readonly _renderManager: RenderManager;

  private readonly _gamepadP1: GamepadManager;
  private readonly _gamepadP2: GamepadManager;

  private _scenario!: ScenarioState;

  constructor(container: HTMLElement) {
    this._renderManager = new RenderManager(container);

    this._gamepadP1 = new GamepadManager(0);
    this._gamepadP2 = new GamepadManager(1);

    this.mainMenu();
    this.animate();
  }

  private startGame = () => {
    this._scenario = {
      scenario: 'pvp-game',
      state: new PvPGameScenario(
        this._renderManager.scene,
        this._renderManager.camera,
        this._renderManager.tween,
        this._gamepadP1,
        this._gamepadP2,
      ),
    };
  };

  private mainMenu = () => {
    this._scenario = {
      scenario: 'main-menu',
      state: new MainMenuScenario(
        this._renderManager.scene,
        this._renderManager.camera,
        this._renderManager.tween,
        this._gamepadP1,
        {
          onPvP: this.startGame,
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
    this._renderManager.tween.update();
    this._renderManager.render();
    this._gamepadP1.poll();
    this._gamepadP2.poll();
  };
}
