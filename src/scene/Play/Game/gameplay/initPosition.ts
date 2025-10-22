import { COLS } from '~/scene/Play/Game/params';
import { Shape } from '~/tetrimino';
import { Plane } from '../types';

export default function initPosition(plane: Plane, shape: Shape) {
  return plane === 'x'
    ? {
        x: Math.floor((COLS - 1) / 2),
        z: Math.ceil((COLS - 1 - shape.length) / 2),
        y: 0,
      }
    : {
        x: Math.ceil((COLS - 1 - shape.length) / 2),
        z: Math.floor((COLS - 1) / 2),
        y: 0,
      };
}
