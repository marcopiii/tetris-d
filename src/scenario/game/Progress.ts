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

export type LineCoord = { y: number } & (
  | { x: number; z?: never }
  | { x?: never; z: number }
  );

function scorePerLines(n: number) {
  if (n < 1) return 0;
  return 50 * n ** 2 + 50 * n;
}

function planeMultiplier(lines: LineCoord[]) {
  if (lines.length < 2) return 1;

  const orthogonalPlanes =
    lines.some((line) => 'x' in line) && lines.some((line) => 'z' in line);
  if (orthogonalPlanes) return 2;

  const parallelPlanes =
    lines.some((line) => line.x != lines[0].x) ||
    lines.some((line) => line.z != lines[0].z);
  if (parallelPlanes) return 1.5;

  return 1;
}
