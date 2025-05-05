import { Group as TWEENGroup } from '@tweenjs/tween.js';
import * as THREE from 'three';
import {
  Button as GamepadButton,
  Event as GamepadEvent,
  GamepadManager,
} from '../../gamepad';
import { CameraCommand } from './commands';
import {
  KeyboardManager,
  type KeyboardEvent as KeyboardEventType,
} from '../../keyboard';
import { ControlsMenu } from './ControlsMenu';
import { ControlsMenuCamera } from './ControlsMenuCamera';
import { ControlsMenuScene } from './ControlsMenuScene';

export class ControlsMenuScenario {
  private readonly _sceneManager: ControlsMenuScene;
  private readonly _cameraManager: ControlsMenuCamera;

  private readonly _keyboard: KeyboardManager;
  private readonly _gamepad: GamepadManager;

  private readonly _menu: ControlsMenu;

  constructor(
    scene: THREE.Scene,
    camera: THREE.Camera,
    tween: TWEENGroup,
    keyboard: KeyboardManager,
    gamepad: GamepadManager,
    scenarioMutation: { onBack: () => void },
  ) {
    this._sceneManager = new ControlsMenuScene(scene);
    this._cameraManager = new ControlsMenuCamera(camera, tween);

    this._keyboard = keyboard;
    this._keyboard.handler = this.keyboardHandler;

    this._gamepad = gamepad;
    this._gamepad.handler = this.controllerHandler;
    this._gamepad.active = true;

    const onAbout = () => {
      window.location.href =
        'https://github.com/marcopiii/tetris-d?tab=readme-ov-file#how-to-play';
    };

    this._menu = new ControlsMenu(scenarioMutation.onBack);
    this._sceneManager.update(this._menu);
  }

  protected onCameraCmd = (command: CameraCommand) => {
    if (command === 'controller') this._cameraManager.move('controller');
    if (command === 'keyboard') this._cameraManager.move('keyboard');
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

  private keyboardHandler = (
    event: KeyboardEventType,
    btn: KeyboardEvent['code'],
  ) => {
    if (event === 'press') {
      if (btn === 'ArrowDown') this.menuCommandHandler('down');
      if (btn === 'ArrowUp') this.menuCommandHandler('up');
      if (btn === 'Enter') this.menuCommandHandler('confirm');
      if (btn === 'ArrowLeft') this.onCameraCmd('controller');
      if (btn === 'ArrowRight') this.onCameraCmd('keyboard');
    }
  };

  private controllerHandler = (event: GamepadEvent, btn: GamepadButton) => {
    if (event === 'press') {
      if (btn === 'padD') this.menuCommandHandler('down');
      if (btn === 'padU') this.menuCommandHandler('up');
      if (btn === 'A') this.menuCommandHandler('confirm');
      if (btn === 'LT') this.onCameraCmd('controller');
      if (btn === 'RT') this.onCameraCmd('keyboard');
    }
  };
}
