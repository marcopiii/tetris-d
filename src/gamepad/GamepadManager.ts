import { mapping } from './mapping';
import { Button, Event } from './types';

export class GamepadManager {
  private readonly _handler: (event: Event, button: Button) => void;
  private _gamepadIndex: number | undefined;
  private _buffer: readonly GamepadButton[];

  constructor(handler: (event: Event, button: Button) => void) {
    this._handler = handler;
    this._gamepadIndex = undefined;
    this._buffer = [];

    window.addEventListener(
      'gamepadconnected',
      (e) => (this._gamepadIndex = e.gamepad.index),
    );
    window.addEventListener(
      'gamepaddisconnected',
      () => (this._gamepadIndex = undefined),
    );
  }

  poll() {
    if (this._gamepadIndex === undefined) return;

    const gamepad = navigator.getGamepads()[this._gamepadIndex];
    if (!gamepad) return;

    gamepad.buttons.forEach((button, i) => {
      const buttonCode = mapping(i);
      if (!buttonCode) return;
      if (button.pressed && !this._buffer[i]?.pressed)
        this._handler('press', buttonCode);
      if (!button.pressed && this._buffer[i]?.pressed)
        this._handler('release', buttonCode);
    });
    this._buffer = gamepad.buttons;
  }
}
