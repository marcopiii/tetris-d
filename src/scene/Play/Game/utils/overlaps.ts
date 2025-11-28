import { MinoCoord } from '~/scene/Play/Game/types';

export const overlaps = (a: MinoCoord) => (b: MinoCoord) =>
  a.x === b.x && a.y === b.y && a.z === b.z;
