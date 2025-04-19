import * as THREE from 'three';
import { createVoxel } from './createMesh';
import { VOXEL_SIZE } from '../params';
import { Char, Font } from './font';

function createChar(
  shape: Char,
  type: 'primary' | 'secondary' | 'main',
  align = 'left',
  disabled = false,
) {
  const charGroup = new THREE.Group();
  shape.map((row, y) => {
    (align === 'left' ? row : row.toReversed()).map((pixel, x) => {
      if (pixel) {
        const voxel = createVoxel(type, disabled);
        voxel.position.set(x * VOXEL_SIZE[type], -y * VOXEL_SIZE[type], 0);
        charGroup.add(voxel);
      }
    });
  });
  return charGroup;
}

export function createWord(font: Font) {
  return (
    word: string,
    type: 'primary' | 'secondary' | 'main',
    align = 'left',
    disabled = false,
  ) => {
    const shapes: Array<Char> = word.split('').map((char) => font[char]);
    const wordGroup = new THREE.Group();
    let offset = 0;
    (align === 'left' ? shapes : shapes.toReversed()).forEach((shape, i) => {
      const charGroup = createChar(shape, type, align, disabled);
      charGroup.position.set(offset * VOXEL_SIZE[type], 0, 0);
      wordGroup.add(charGroup);
      offset += shape[0].length + 1;
    });
    return wordGroup;
  };
}
