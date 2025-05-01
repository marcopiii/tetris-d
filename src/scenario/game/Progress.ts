import { LineCoord } from './types';

export class Progress {
  private _clearedLines: number;
  private _cascadeBuffer: LineCoord[];
  private _score: number;

  private LINE_CLEAR_PER_LEVEL = 10;

  constructor() {
    this._clearedLines = 0;
    this._cascadeBuffer = [];
    this._score = 0;
  }

  get score() {
    return this._score;
  }

  get level() {
    return Math.floor(this._clearedLines / this.LINE_CLEAR_PER_LEVEL) + 1;
  }

  add(clearedLines: LineCoord[]) {
    const lines = clearedLines.length
      ? [...clearedLines, ...this._cascadeBuffer]
      : [];
    this._cascadeBuffer = lines;
    const base = scorePerLines(lines.length);
    const multiplier = planeMultiplier(lines);
    const gain = base * multiplier * this.level;
    this._score += gain;
    this._clearedLines += clearedLines.length;
  }
}

function scorePerLines(n: number) {
  if (n < 1) return 0;
  return 50 * n ** 2 + 50 * n;
}

function planeMultiplier(lines: LineCoord[]) {
  if (lines.length < 2) return 1;

  const orthogonalPlanes =
    lines.some((line) => 'x' in line) && lines.some((line) => 'z' in line);
  if (orthogonalPlanes) return 1.5;

  const parallelPlanes =
    lines.some((line) => line.x != lines[0].x) ||
    lines.some((line) => line.z != lines[0].z);
  if (parallelPlanes) return 1.25;

  return 1;
}
