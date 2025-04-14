import * as THREE from 'three';
import {
  Button as GamepadButton,
  Event as GamepadEvent,
  GamepadManager,
} from '../../gamepad';
import { MainMenu } from './MainMenu';
import { MainMenuCameraManager } from './MainMenuCameraManager';
import { MainMenuSceneManager } from './MainMenuSceneManager';

export class MainMenuScenario {
  private readonly _sceneManager: MainMenuSceneManager;
  private readonly _cameraManager: MainMenuCameraManager;

  private readonly _gamepad: GamepadManager;
  private readonly _menu: MainMenu;

  constructor(
    scene: THREE.Scene,
    camera: THREE.Camera,
    gamepad: GamepadManager,
    scenarioMutation: {
      onPvP: () => void;
      onExit: () => void;
    },
  ) {
    this._sceneManager = new MainMenuSceneManager(scene);
    this._cameraManager = new MainMenuCameraManager(camera);

    this._gamepad = gamepad;
    this._gamepad.handler = this.controllerHandler;
    this._gamepad.active = true;

    this._menu = new MainMenu(scenarioMutation.onPvP, scenarioMutation.onExit);
    this._sceneManager.update(this._menu);
  }

  private menuCommandHandler = (command: 'up' | 'down' | 'confirm') => {
    if (command === 'confirm') {
      this._menu.select();
      return;
    }
    if (command === 'up') this._menu.navigate('up');
    if (command === 'down') this._menu.navigate('down');
    this._sceneManager.update(this._menu);
  };

  private controllerHandler = (event: GamepadEvent, btn: GamepadButton) => {
    if (event === 'press') {
      if (btn === 'padD') this.menuCommandHandler('down');
      if (btn === 'padU') this.menuCommandHandler('up');
      if (btn === 'A') this.menuCommandHandler('confirm');
    }
  };
}
