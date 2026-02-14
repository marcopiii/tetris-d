import { GameParams } from '~/scene/Play/Game/params';
import { LineCoord, MinoCoord } from '../types';

const smartCheckZAxisRow =
  (blocks: MinoCoord[], cols: number) => (y: number, x: number) => {
    for (let z = 0; z < cols; z++) {
      if (!blocks.some((b) => b.x === x && b.y === y && b.z === z))
        return false;
    }
    return true;
  };

const smartCheckXAxisRow =
  (blocks: MinoCoord[], cols: number) => (y: number, z: number) => {
    for (let x = 0; x < cols; x++) {
      if (!blocks.some((b) => b.x === x && b.y === y && b.z === z))
        return false;
    }
    return true;
  };

export default function checkCompletedLines(
  blocks: MinoCoord[],
  { cols, rows, vanishZoneRows }: GameParams,
) {
  const checkZAxisRow = smartCheckZAxisRow(blocks, cols);
  const checkXAxisRow = smartCheckXAxisRow(blocks, cols);
  const clearedLines: LineCoord[] = [];
  for (let y = 0; y < rows + vanishZoneRows; y++) {
    for (let z = 0; z < cols; z++) {
      if (checkXAxisRow(y, z)) {
        clearedLines.push({ y, z });
      }
    }
    for (let x = 0; x < cols; x++) {
      if (checkZAxisRow(y, x)) {
        clearedLines.push({ y, x });
      }
    }
  }
  return clearedLines;
}
