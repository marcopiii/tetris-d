import { GameParams } from '~/scene/Play/Game/params';
import { Shape } from '~/tetrimino';
import { Plane } from '../types';

export default function initPosition(
  plane: Plane,
  shape: Shape,
  { cols }: GameParams,
) {
  return plane === 'x'
    ? {
        x: Math.floor((cols - 1) / 2),
        z: Math.ceil((cols - 1 - shape.length) / 2),
        y: 0,
      }
    : {
        x: Math.ceil((cols - 1 - shape.length) / 2),
        z: Math.floor((cols - 1) / 2),
        y: 0,
      };
}
