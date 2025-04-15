import { Group as TWEENGroup } from '@tweenjs/tween.js';
import * as THREE from 'three';
import {
  Button as GamepadButton,
  Event as GamepadEvent,
  GamepadManager,
} from '../../gamepad';
import {CameraAction} from "../pvpGame/PvPScenario";
import { MainMenu } from './MainMenu';
import { MainMenuCamera } from './MainMenuCamera';
import { MainMenuScene } from './MainMenuScene';

export class MainMenuScenario {
  private readonly _sceneManager: MainMenuScene;
  private readonly _cameraManager: MainMenuCamera;

  private readonly _gamepad: GamepadManager;
  private readonly _menu: MainMenu;

  constructor(
    scene: THREE.Scene,
    camera: THREE.Camera,
    tween: TWEENGroup,
    gamepad: GamepadManager,
    scenarioMutation: {
      onPvP: () => void;
      onExit: () => void;
    },
  ) {
    this._sceneManager = new MainMenuScene(scene);
    this._cameraManager = new MainMenuCamera(camera, tween);

    this._gamepad = gamepad;
    this._gamepad.handler = this.controllerHandler;
    this._gamepad.active = true;

    this._menu = new MainMenu(scenarioMutation.onPvP, scenarioMutation.onExit);
    this._sceneManager.update(this._menu);
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
  };

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
      if (btn === 'LT') this.cameraCommandHandler({ type: 'move', direction: 'left' });
      if (btn === 'RT') this.cameraCommandHandler({ type: 'move', direction: 'right' });
    }
  };
}
