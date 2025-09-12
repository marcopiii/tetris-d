import { COLS, ROWS, VANISH_ZONE_ROWS } from '../params';
import { LineCoord } from '../scenario/game/types';

const smartCheckZAxisRow =
  (blocks: { y: number; x: number; z: number }[]) => (y: number, x: number) => {
    for (let z = 0; z < COLS; z++) {
      if (!blocks.some((b) => b.x === x && b.y === y && b.z === z))
        return false;
    }
    return true;
  };

const smartCheckXAxisRow =
  (blocks: { y: number; x: number; z: number }[]) => (y: number, z: number) => {
    for (let x = 0; x < COLS; x++) {
      if (!blocks.some((b) => b.x === x && b.y === y && b.z === z))
        return false;
    }
    return true;
  };

export const checkCompletedLines = (
  blocks: { y: number; x: number; z: number }[],
) => {
  const checkZAxisRow = smartCheckZAxisRow(blocks);
  const checkXAxisRow = smartCheckXAxisRow(blocks);
  const clearedLines: LineCoord[] = [];
  for (let y = 0; y < ROWS + VANISH_ZONE_ROWS; y++) {
    for (let z = 0; z < COLS; z++) {
      if (checkXAxisRow(y, z)) {
        clearedLines.push({ y, z });
      }
    }
    for (let x = 0; x < COLS; x++) {
      if (checkZAxisRow(y, x)) {
        clearedLines.push({ y, x });
      }
    }
  }
  return clearedLines;
};
