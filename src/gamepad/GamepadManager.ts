import { Button, Event } from './types';

export class GamepadManager {
  private readonly _handler: (event: Event, button: Button) => void;
  private _gamepadIndex: number | undefined;
  private _buffer: readonly GamepadButton[];

  constructor(handler: (event: Event, button: Button) => void) {
    this._handler = handler;
    this._gamepadIndex = undefined;
    this._buffer = [];
  }

  connect(gamepad: Gamepad) {
    this._gamepadIndex = gamepad.index;
  }

  disconnect() {
    this._gamepadIndex = undefined;
  }

  poll() {
    if (this._gamepadIndex === undefined) return;

    const gamepad = navigator.getGamepads()[this._gamepadIndex];

    if (!gamepad) return;

    gamepad.buttons.forEach((button, i) => {
      const buttonCode = buttonMapping(i);
      if (!buttonCode) return;
      if (button.pressed && !this._buffer[i]?.pressed)
        this._handler('press', buttonCode);
      if (!button.pressed && this._buffer[i]?.pressed)
        this._handler('release', buttonCode);
    });
    this._buffer = gamepad.buttons;
  }
}

function buttonMapping(i: number): Button | undefined {
  switch (i) {
    case 0:
      return 'A';
    case 1:
      return 'B';
    case 2:
      return 'X';
    case 3:
      return 'Y';
    case 4:
      return 'LB';
    case 5:
      return 'RB';
    case 6:
      return 'LT';
    case 7:
      return 'RT';
    case 9:
      return 'start';
    case 12:
      return 'padU';
    case 13:
      return 'padD';
    case 14:
      return 'padL';
    case 15:
      return 'padR';
    default:
      return undefined;
  }
}
