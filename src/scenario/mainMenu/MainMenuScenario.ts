import { Group as TWEENGroup } from '@tweenjs/tween.js';
import * as THREE from 'three';
import {
  Button as GamepadButton,
  Event as GamepadEvent,
  GamepadManager,
} from '../../gamepad';
import { CameraCommand } from './commands';
import { MainMenu } from './MainMenu';
import { MainMenuCamera } from './MainMenuCamera';
import { MainMenuScene } from './MainMenuScene';
import {
  KeyboardManager,
  type KeyboardEvent as KeyboardEventType,
} from '../../keyboard';

export class MainMenuScenario {
  private readonly _sceneManager: MainMenuScene;
  private readonly _cameraManager: MainMenuCamera;

  private readonly _keyboard: KeyboardManager;
  private readonly _gamepad: GamepadManager;

  private readonly _menu: MainMenu;

  constructor(
    scene: THREE.Scene,
    camera: THREE.Camera,
    tween: TWEENGroup,
    keyboard: KeyboardManager,
    gamepad: GamepadManager,
    scenarioMutation: { onPvE: () => void; onCommands: () => void },
  ) {
    this._sceneManager = new MainMenuScene(scene);
    this._cameraManager = new MainMenuCamera(camera, tween);

    this._keyboard = keyboard;
    this._keyboard.handler = this.keyboardHandler;

    this._gamepad = gamepad;
    this._gamepad.handler = this.controllerHandler;
    this._gamepad.active = true;

    const onAbout = () => {
      window.location.href =
        'https://github.com/marcopiii/tetris-d?tab=readme-ov-file#how-to-play';
    };

    this._menu = new MainMenu(
      scenarioMutation.onPvE,
      scenarioMutation.onCommands,
      onAbout,
    );
    this._sceneManager.update(this._menu);
  }

  protected onCameraCmd = (command: CameraCommand) => {
    if (command === 'moveL') this._cameraManager.move('left');
    if (command === 'moveR') this._cameraManager.move('right');
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
      if (btn === 'ArrowLeft') this.onCameraCmd('moveL');
      if (btn === 'ArrowRight') this.onCameraCmd('moveR');
    }
  };

  private controllerHandler = (event: GamepadEvent, btn: GamepadButton) => {
    if (event === 'press') {
      if (btn === 'padD') this.menuCommandHandler('down');
      if (btn === 'padU') this.menuCommandHandler('up');
      if (btn === 'A') this.menuCommandHandler('confirm');
      if (btn === 'LT') this.onCameraCmd('moveL');
      if (btn === 'RT') this.onCameraCmd('moveR');
    }
  };
}
