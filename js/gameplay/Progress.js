export class Progress {

    constructor() {
        this._level = 1;
        this._score = 0;
    }

    get score() {
        return this._score;
    }

    get level() {
        return this._level;
    }

    add(lineClear: number) {
        const base = LINE_CLEAR_BASE_POINTS[lineClear] ?? 0
        const gain = base * this._level
        this._score += gain;
    }

}

const LINE_CLEAR_BASE_POINTS = [
    0,
    100,
    300,
    500,
    800,
    1100,
    1500,
    2000,
    2500
]