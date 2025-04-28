import { mapping } from './mapping';

export type Button =
  | 'start'
  | 'select'
  | 'padL'
  | 'padD'
  | 'padR'
  | 'padU'
  | 'A'
  | 'B'
  | 'X'
  | 'Y'
  | 'LB'
  | 'RB'
  | 'LT'
  | 'RT';

export type Event = 'press' | 'hold' | 'release' | 'lift';

const HOLD_FRAMES = 9;
const BUFFER_SIZE = HOLD_FRAMES + 1;

export class GamepadManager {
  private _handler: (event: Event, button: Button) => void;
  private readonly _gamepadIndex: number;
  private _buffer: readonly GamepadButton[][];
  private _active: boolean;

  constructor(index: number) {
    this._handler = () => {};
    this._gamepadIndex = index;
    this._buffer = new Array(BUFFER_SIZE).fill([]);
    this._active = index === 0;
  }

  set handler(handler: (event: Event, button: Button) => void) {
    this._handler = handler;
  }

  set active(active: boolean) {
    this._buffer = new Array(BUFFER_SIZE).fill([]);
    this._active = active;
  }

  poll() {
    const gamepad = navigator.getGamepads()[this._gamepadIndex];
    if (!gamepad) return;
    if (!this._active) return;

    gamepad.buttons.forEach((button, i) => {
      const buttonCode = mapping(i);
      if (!buttonCode) return;

      const wasPressed = this._buffer[0][i]?.pressed ?? false;
      const isHolding = this._buffer.slice(0,HOLD_FRAMES).every((b) => b[i]?.pressed ?? false);
      const wasHeld = this._buffer.every((b) => b[i]?.pressed ?? false)

      if (button.pressed && !wasPressed)
        this._handler('press', buttonCode);
      if (button.pressed && isHolding && !wasHeld)
        this._handler('hold', buttonCode);
      if (!button.pressed && wasPressed && !wasHeld)
        this._handler('lift', buttonCode);
      if (!button.pressed && wasHeld)
        this._handler('release', buttonCode);
    });
    this._buffer = [[...gamepad.buttons], ...this._buffer].slice(
      0,
      BUFFER_SIZE,
    );
  }
}
