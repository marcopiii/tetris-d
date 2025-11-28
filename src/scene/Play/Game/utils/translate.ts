import * as THREE from 'three';
import { COLS, ROWS, VANISH_ZONE_ROWS } from '~/scene/Play/Game/params';

const offset = new THREE.Vector3(1 / 2, -1 / 2, 1 / 2);

const translateX = (x: number) => x + offset.x - COLS / 2;
const translateY = (y: number) => -y + VANISH_ZONE_ROWS + offset.y + ROWS / 2;
const translateZ = (z: number) => z + offset.z - COLS / 2;

/**
 * translations from the board coord system to the scene coord system
 */
export default function (
  x: number,
  y: number,
  z: number,
): [number, number, number] {
  return [translateX(x), translateY(y), translateZ(z)];
}
