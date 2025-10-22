import { match } from 'ts-pattern';
import { comboKind } from './combo';
import { LineCoord } from '../../types';
import { ComboKind } from './types';

export function pointsPerHardDrop(length: number) {
  return length * 2;
}

export const pointsPerClear =
  (level: number) => (effectiveLines: LineCoord[]) => {
    const base = pointsPerLines(effectiveLines.length);
    const combo = comboKind(effectiveLines);
    const multiplier = comboMultiplier(combo);
    return {
      gain: base * multiplier * level,
      combo,
    };
  };

function pointsPerLines(n: number) {
  if (n < 1) return 0;
  return 50 * n ** 2 + 50 * n;
}

function comboMultiplier(comboKind: ComboKind) {
  return match(comboKind)
    .with('std', () => 1)
    .with('par', () => 1.25)
    .with('ort', () => 1.5)
    .exhaustive();
}
