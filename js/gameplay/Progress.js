class Progress {

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

    add(rows: number) {
        this._score += BASE_POINTS_PER_ROW[rows] * this._level;
    }

}

const BASE_POINTS_PER_ROW = [
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