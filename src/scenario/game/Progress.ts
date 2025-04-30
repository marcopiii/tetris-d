export class Progress {
  private _lineClear: number;
  private _score: number;

  private LINE_CLEAR_PER_LEVEL = 10;

  constructor() {
    this._lineClear = 0;
    this._score = 0;
  }

  get score() {
    return this._score;
  }

  get level() {
    return Math.floor(this._lineClear / this.LINE_CLEAR_PER_LEVEL) + 1;
  }

  add(lineClear: number) {
    const base = scorePerLines(lineClear) ?? 0;
    const gain = base * this.level;
    this._score += gain;
    this._lineClear += lineClear;
  }
}

function scorePerLines(n: number) {
  if (n < 1) return 0;
  return 50 * n ** 2 + 50 * n;
}
