import { isNotNil } from 'es-toolkit/predicate';
import { match, P } from 'ts-pattern';
import { PlaneCombo } from '../gameplay';

function lineComboName(lineCombo: number): string {
  return match(lineCombo)
    .with(1, () => 'SINGLE')
    .with(2, () => 'DOUBLE')
    .with(3, () => 'TRIPLE')
    .with(4, () => 'TETRIS')
    .with(5, () => 'PENTRIS')
    .with(6, () => 'HEXATRIS')
    .with(7, () => 'HEPTATRIS')
    .with(8, () => 'OCTATRIS')
    .with(9, () => 'NONATRIS')
    .with(10, () => 'DECATRIS')
    .with(11, () => 'UNDECATRIS')
    .with(12, () => 'DUODECATRIS')
    .with(13, () => 'TRISDECATRIS')
    .with(14, () => 'TETRADECATRIS')
    .with(15, () => 'PENTADECATRIS')
    .with(16, () => 'HEXADECATRIS')
    .with(17, () => 'HEPTADECATRIS')
    .with(18, () => 'OCTADECATRIS')
    .with(19, () => 'NONADECATRIS')
    .with(20, () => 'VIGINTATRIS')
    .with(P.number.gt(20), () => 'WHAT THE FUCK')
    .otherwise(() => {
      throw new Error('Line count must be positive');
    });
}

function planeComboName(planeCombo: PlaneCombo) {
  return match(planeCombo)
    .with('mono', () => undefined)
    .with('parallel', () => 'PAR')
    .with('orthogonal', () => 'ORT')
    .exhaustive();
}

function cascadeComboName(cascadeCombo: number) {
  return match(cascadeCombo)
    .with(1, () => 'CASCADE')
    .with(P.number.gt(1), (n) => `${n}x CASCADE`)
    .otherwise(() => undefined);
}

export default function comboName(
  lines: number,
  cascade: number,
  planeCombo: PlaneCombo,
) {
  return [
    cascadeComboName(cascade),
    cascade ? undefined : planeComboName(planeCombo),
    lineComboName(lines),
  ]
    .filter(isNotNil)
    .join(' ');
}
