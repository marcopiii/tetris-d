import { Vector3Like } from 'three';
import { Plane } from '~/scene/Play/Game/types';
import { Shape } from '~/tetrimino';

export function calculateMatrix(
  shape: Shape,
  position: Vector3Like,
  plane: Plane,
) {
  return shape
    .flatMap((layer, dy) =>
      layer.map((exists, k) => {
        if (!exists) return undefined;
        const dx = plane === 'x' ? 0 : k;
        const dz = plane === 'z' ? 0 : k;
        return {
          y: position.y + dy,
          x: position.x + dx,
          z: position.z + dz,
        };
      }),
    )
    .filter((b) => !!b);
}
