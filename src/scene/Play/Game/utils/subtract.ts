import { MinoCoord } from '../types';

export default function subtract(
  as: MinoCoord[],
  bs: MinoCoord[],
): MinoCoord[] {
  return as.filter((a) => !bs.some(isOverlapping(a)));
}

const isOverlapping = (a: MinoCoord) => (b: MinoCoord) =>
  a.x === b.x && a.y === b.y && a.z === b.z;
