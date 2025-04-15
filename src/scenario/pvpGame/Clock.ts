export class Clock {
  private readonly _callback: () => void;
  private _interval: NodeJS.Timeout | undefined;

  private SPEED = 1500;

  constructor(callback: () => void) {
    this._callback = callback;
    this._interval = undefined;
  }

  get isRunning(): boolean {
    return this._interval !== undefined;
  }

  toggle() {
    if (this._interval) {
      clearInterval(this._interval);
      this._interval = undefined;
    } else {
      this._interval = setInterval(this._callback, this.SPEED);
    }
  }

  start() {
    clearInterval(this._interval);
    this._interval = setInterval(this._callback, this.SPEED);
  }
}
