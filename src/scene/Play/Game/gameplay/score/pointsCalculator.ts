import { match } from 'ts-pattern';
import { planeComboPerLines } from '~/scene/Play/Game/gameplay/score/comboDetector';
import { LineCoord } from '../../types';
import { PlaneCombo } from './types';

export function pointsPerHardDrop(length: number) {
  return length * 2;
}

export const pointsPerClear =
  (level: number) => (effectiveLines: LineCoord[]) => {
    const base = pointsPerLines(effectiveLines.length);
    const planeCombo = planeComboPerLines(effectiveLines);
    const multiplier = planeComboMultiplier(planeCombo);
    return base * multiplier * level;
  };

function pointsPerLines(n: number) {
  if (n < 1) return 0;
  return 50 * n ** 2 + 50 * n;
}

function planeComboMultiplier(combo: PlaneCombo) {
  return match(combo)
    .with('mono', () => 1)
    .with('parallel', () => 1.25)
    .with('orthogonal', () => 1.5)
    .exhaustive();
}

export const pointsPerTSpin =
  (level: number) => (clears: number, kind: 'mini' | 'full') => {
    const base = match([clears, kind])
      .with([0, 'mini'], () => 100)
      .with([0, 'full'], () => 400)
      .with([1, 'mini'], () => 200)
      .with([1, 'full'], () => 800)
      .with([2, 'mini'], () => 400)
      .with([2, 'full'], () => 1200)
      .with([3, 'full'], () => 1600)
      .otherwise(() => {
        throw new Error('impossibiru');
      });
    return base * level;
  };
