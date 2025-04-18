export type Event = 'press' | 'release';

export class KeyboardManager {
  private _handler: (event: Event, button: KeyboardEvent['code']) => void;

  constructor() {
    this._handler = () => {};

    this._handleKeyDown = this._handleKeyDown;
    this._handleKeyUp = this._handleKeyUp;

    window.addEventListener('keydown', this._handleKeyDown);
    window.addEventListener('keyup', this._handleKeyUp);
  }

  set handler(handler: (event: Event, button: KeyboardEvent['code']) => void) {
    this._handler = handler;
  }

  private _handleKeyDown = (event: KeyboardEvent) => {
    // if (event.repeat) return;
    this._handler('press', event.code);
  };

  private _handleKeyUp = (event: KeyboardEvent) => {
    this._handler('release', event.code);
  };
}
