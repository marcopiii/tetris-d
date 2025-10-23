import { match } from 'ts-pattern';
import { comboKind } from './combo';
import { LineCoord } from '../../types';
import { PlaneCombo } from './types';

export function pointsPerHardDrop(length: number) {
  return length * 2;
}

export const pointsPerClear =
  (level: number) => (effectiveLines: LineCoord[]) => {
    const base = pointsPerLines(effectiveLines.length);
    const combo = comboKind(effectiveLines);
    const multiplier = planeComboMultiplier(combo);
    return {
      gain: base * multiplier * level,
      combo,
    };
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
