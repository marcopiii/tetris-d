export class Progress {

    constructor() {
        this._lineClear = 0;
        this._score = 0;
    }

    get score() {
        return this._score;
    }

    get level() {
        return Math.floor(this._lineClear / LINE_CLEAR_PER_LEVEL) + 1;
    }

    add(lineClear: number) {
        const base = LINE_CLEAR_BASE_POINTS[lineClear] ?? 0
        const gain = base * this.level
        this._score += gain;
        this._lineClear += lineClear
    }

}

const LINE_CLEAR_PER_LEVEL = 10;

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