export class Clock {
    constructor(callback) {
        this._callback = callback;
        this._interval = undefined;
    }

    #SPEED = 1000;

    get isRunning() {
        return this._interval !== undefined
    }

    toggle() {
        if (this._interval) {
            clearInterval(this._interval);
            this._interval = undefined;
        } else {
            this._interval = setInterval(this._callback, this.#SPEED);
        }
    }

    start() {
        clearInterval(this._interval)
        this._interval = setInterval(this._callback, this.#SPEED);
    }

}
