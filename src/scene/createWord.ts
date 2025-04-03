import * as THREE from 'three';
import { createVoxel } from './createMesh';
import { font } from './font';
import { VOXEL_SIZE } from '../params';
import { Shape } from './types';

function createChar(
  shape: Shape,
  size: 'primary' | 'secondary',
  align = 'left',
) {
  const charGroup = new THREE.Group();
  shape.map((row, y) => {
    (align === 'left' ? row : row.toReversed()).map((pixel, x) => {
      if (pixel) {
        const voxel = createVoxel(size);
        voxel.position.set(x * VOXEL_SIZE[size], -y * VOXEL_SIZE[size], 0);
        charGroup.add(voxel);
      }
    });
  });
  return charGroup;
}

export function createWord(
  word: string,
  size: 'primary' | 'secondary',
  align = 'left',
) {
  const shapes: Array<Shape> = word.split('').map((char) => font[char]);
  const wordGroup = new THREE.Group();
  let offset = 0;
  (align === 'left' ? shapes : shapes.toReversed()).forEach((shape, i) => {
    const charGroup = createChar(shape, size, align);
    charGroup.position.set(offset * VOXEL_SIZE[size], 0, 0);
    wordGroup.add(charGroup);
    offset += shape[0].length + 1;
  });
  return wordGroup;
}
