import { overlaps } from './overlaps';
import { MinoCoord } from '../types';

export default function subtract(
  as: MinoCoord[],
  bs: MinoCoord[],
): MinoCoord[] {
  return as.filter((a) => !bs.some(overlaps(a)));
}
