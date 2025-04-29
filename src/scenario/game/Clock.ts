export class Clock {
  private readonly _callback: () => void;
  private _interval: NodeJS.Timeout | undefined;
  private _level: number;

  constructor(callback: () => void) {
    this._level = 1;
    this._callback = callback;
    this._interval = undefined;
  }

  private speed() {
    return 1000 / (gravity[this._level] * 60);
  }

  get isRunning(): boolean {
    return this._interval !== undefined;
  }

  toggle() {
    if (this._interval) {
      clearInterval(this._interval);
      this._interval = undefined;
    } else {
      this._interval = setInterval(this._callback, this.speed());
    }
  }

  start() {
    clearInterval(this._interval);
    this._interval = setInterval(this._callback, this.speed());
  }

  set level(lvl: number) {
    this._level = lvl;
    clearInterval(this._interval);
    this._interval = setInterval(this._callback, this.speed());
  }

  set fastDrop(active: boolean) {
    if (!this.isRunning)
      return;

    if (gravity[this._level] > 1)
      return;

    clearInterval(this._interval);
    if (active) {
      this._interval = setInterval(this._callback, 1000/60);
    } else {
      this._interval = setInterval(this._callback, this.speed());
    }
  }
}

/** @see https://harddrop.com/wiki/Tetris_Worlds */
const gravity = [
  0, 0.01667, 0.021017, 0.026977, 0.035256, 0.04693, 0.06361, 0.0879, 0.1236,
  0.1775, 0.2598, 0.388, 0.59, 0.92, 1.46, 2.36,
];
