import { mapping } from './mapping';
import { Button, Event } from './types';

export class GamepadManager {
  private readonly _handler: (event: Event, button: Button) => void;
  private readonly _gamepadIndex: number;
  private _buffer: readonly GamepadButton[];
  private _active: boolean;

  constructor(index: number, handler: (event: Event, button: Button) => void) {
    this._handler = handler;
    this._gamepadIndex = index;
    this._buffer = [];
    this._active = index === 0;
  }

  set active(active: boolean) {
    this._buffer = [];
    this._active = active;
  }

  poll() {
    const gamepad = navigator.getGamepads()[this._gamepadIndex];
    if (!gamepad) return;
    if (!this._active) return;

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
