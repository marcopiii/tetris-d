import { BoardMatrix } from './types';
import { GameParams } from '../../params';

export function createEmptyMatrix({
  cols,
  rows,
  vanishZoneRows,
}: GameParams): BoardMatrix {
  return Array(rows + vanishZoneRows)
    .fill(null)
    .map(() =>
      Array(cols)
        .fill(null)
        .map(() => Array(cols).fill(null)),
    );
}
