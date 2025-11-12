import { match, P } from 'ts-pattern';
import { PlaneCombo, TSpinKind, ZicKind } from './types';

export function pointsPerSoftDrop(length: number) {
  return length;
}

export function pointsPerHardDrop(length: number) {
  return length * 2;
}

export function pointsPerLines(n: number) {
  if (n < 1) return 0;
  return 50 * n ** 2 + 50 * n;
}

export function planeComboMultiplier(combo: PlaneCombo) {
  return match(combo)
    .with('mono', () => 1)
    .with('parallel', () => 1.25)
    .with('orthogonal', () => 1.5)
    .exhaustive();
}

// https://tetris.wiki/Scoring#Recent_guideline_compatible_games
export const pointsPerTSpin =
  (level: number) => (clears: number, kind: TSpinKind) => {
    const base = match([clears, kind])
      .with([0, 'mini'], () => 100)
      .with([1, 'mini'], () => 200)
      .with([2, 'mini'], () => 400)
      .with([0, 'full'], () => 400)
      .with([1, 'full'], () => 800)
      .with([2, 'full'], () => 1200)
      .with([3, 'full'], () => 1600)
      .otherwise(() => {
        throw new Error('impossibiru');
      });
    return base * level;
  };

export const pointsPerZic =
  (level: number) => (clears: number, kind: ZicKind) => {
    const base = match([clears, kind])
      .with([0, 'mini'], () => 100)
      .with([1, 'mini'], () => 200)
      .with([2, 'mini'], () => 400)
      .with([P.number.between(3, 4), 'mini'], () => 800)
      .with([0, 'full'], () => 400)
      .with([1, 'full'], () => 800)
      .with([2, 'full'], () => 1200)
      .with([P.number.between(3, 4), 'full'], () => 1600)
      .otherwise(() => {
        throw new Error('impossibiru');
      });
    return base * level;
  };

// https://tetris.wiki/Scoring#Recent_guideline_compatible_games
export const pointsPerPlaneClear = (level: number) => (lines: number) => {
  const base = match(lines)
    .with(1, () => 800)
    .with(2, () => 1200)
    .with(3, () => 1800)
    .with(4, () => 2000)
    .otherwise(() => {
      throw new Error('impossibiru');
    });
  return base * level;
};
