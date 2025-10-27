import { BoardMatrix } from './types';
import { COLS, ROWS, VANISH_ZONE_ROWS } from '../../params';

export const emptyMatrix: BoardMatrix = Array(ROWS + VANISH_ZONE_ROWS)
  .fill(null)
  .map(() =>
    Array(COLS)
      .fill(null)
      .map(() => Array(COLS).fill(null)),
  );
