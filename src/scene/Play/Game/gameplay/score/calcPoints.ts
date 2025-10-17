import { match } from 'ts-pattern';
import { LineCoord } from '../../types';
import { ComboKind } from './types';

export default (level: number) => (effectiveLines: LineCoord[]) => {
  const base = scorePerLines(effectiveLines.length);
  const combo = comboKind(effectiveLines);
  const multiplier = planeMultiplier(combo);
  return {
    gain: base * multiplier * level,
    combo,
  };
};

function scorePerLines(n: number) {
  if (n < 1) return 0;
  return 50 * n ** 2 + 50 * n;
}

function comboKind(lines: LineCoord[]): ComboKind {
  if (lines.length < 2) return 'std';

  const orthogonalPlanes =
    lines.some((line) => 'x' in line) && lines.some((line) => 'z' in line);
  if (orthogonalPlanes) return 'ort';

  const parallelPlanes =
    lines.some((line) => line.x != lines[0].x) ||
    lines.some((line) => line.z != lines[0].z);
  if (parallelPlanes) return 'par';

  return 'std';
}

function planeMultiplier(comboKind: ComboKind) {
  return match(comboKind)
    .with('std', () => 1)
    .with('par', () => 1.25)
    .with('ort', () => 1.5)
    .exhaustive();
}
