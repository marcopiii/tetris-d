import { CameraManager } from '../camera';
import {
  Button as GamepadButton,
  Event as GamepadEvent,
  GamepadManager,
} from '../gamepad';
import { MainMenu } from '../menu';
import { SceneManager } from '../scene';

export class MainMenuScenario {
  private readonly _sceneManager: SceneManager;
  private readonly _cameraManager: CameraManager;

  private readonly _gamepad: GamepadManager;

  private readonly _menu: MainMenu;

  constructor(
    sceneManager: SceneManager,
    cameraManager: CameraManager,
    gamepad: GamepadManager,
    scenarioMutation: {
      onPvP: () => void;
      onExit: () => void;
    },
  ) {
    this._sceneManager = sceneManager;
    this._cameraManager = cameraManager;
    // todo: setup the camera for the menu

    this._gamepad = gamepad;
    this._gamepad.handler = this.controllerHandler;
    this._gamepad.active = true;

    this._menu = new MainMenu(scenarioMutation.onPvP, scenarioMutation.onExit);
  }

  private menuCommandHandler = (command: 'up' | 'down' | 'confirm') => {
    if (command === 'confirm') this._menu.select();
    if (command === 'up') this._menu.navigate('up');
    if (command === 'down') this._menu.navigate('down');
    // todo: update the scene
  };

  private controllerHandler = (event: GamepadEvent, btn: GamepadButton) => {
    if (event === 'press') {
      if (btn === 'padD') this.menuCommandHandler('down');
      if (btn === 'padU') this.menuCommandHandler('up');
      if (btn === 'A') this.menuCommandHandler('confirm');
    }
  };
}
