export class Clock {
  constructor() {
    this._interval = undefined;
  }

  #SPEED = 500;

  pause() {
    clearInterval(this._interval);
  }

  resume(callback) {
    clearInterval(this._interval)
    this._interval = setInterval(callback, this.#SPEED);
  }


}
