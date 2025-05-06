import { Group as TWEENGroup } from '@tweenjs/tween.js';
import * as THREE from 'three';
import {
  Button as GamepadButton,
  Event as GamepadEvent,
  GamepadManager,
} from '../../gamepad';
import { SemanticButton } from '../../keybindings/keybinding';
import {
  resetGamepadKeybindings,
  resetKeyboardKeybindings,
  updateGamepadKeybindings,
} from '../../keybindings/utils';
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
    this._gamepad.handler = this.gamepadHandler;
    this._gamepad.active = true;

    this._menu = new ControlsMenu(scenarioMutation.onBack, this.reset);
    this._sceneManager.update(this._menu);
  }

  private menuCommandHandler = (
    command: 'up' | 'down' | 'confirm' | 'gamepad' | 'keyboard',
  ) => {
    if (command === 'confirm') {
      const terminal = this._menu.select();
      if (terminal) return;
    }
    if (command === 'up') this._menu.navigate('up');
    if (command === 'down') this._menu.navigate('down');
    if (command === 'gamepad') {
      this._menu.currentController = 'gamepad';
      this._cameraManager.move('gamepad');
    }
    if (command === 'keyboard') {
      this._menu.currentController = 'keyboard';
      this._cameraManager.move('keyboard');
    }
    this._sceneManager.update(this._menu);
  };

  private remap = (action: SemanticButton, btn: GamepadButton) => {
    updateGamepadKeybindings(action, btn);
    this._menu.currentAction = undefined;
    this._menu.refreshItems();
    this._sceneManager.update(this._menu);
  };

  private reset = () => {
    if (this._menu.currentController === 'gamepad') {
      resetGamepadKeybindings();
    } else {
      resetKeyboardKeybindings();
    }
    this._menu.currentAction = undefined;
    this._menu.refreshItems();
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
      if (btn === 'ArrowLeft') this.menuCommandHandler('gamepad');
      if (btn === 'ArrowRight') this.menuCommandHandler('keyboard');
    }
  };

  private gamepadHandler = (event: GamepadEvent, btn: GamepadButton) => {
    if (event === 'press') {
      if (
        this._menu.currentController === 'gamepad' &&
        this._menu.currentAction
      ) {
        this.remap(this._menu.currentAction, btn);
        return;
      }
      if (btn === 'padD') this.menuCommandHandler('down');
      if (btn === 'padU') this.menuCommandHandler('up');
      if (btn === 'A') this.menuCommandHandler('confirm');
      if (btn === 'LT') this.menuCommandHandler('gamepad');
      if (btn === 'RT') this.menuCommandHandler('keyboard');
    }
  };
}
