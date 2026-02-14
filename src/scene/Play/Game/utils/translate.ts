import * as THREE from 'three';
import { GameParams } from '~/scene/Play/Game/params';

const offset = new THREE.Vector3(1 / 2, -1 / 2, 1 / 2);

/**
 * translations from the board coord system to the scene coord system
 */
export default function (
  x: number,
  y: number,
  z: number,
  { cols, rows, vanishZoneRows }: GameParams,
): [number, number, number] {
  return [
    x + offset.x - cols / 2,
    -y + vanishZoneRows + offset.y + rows / 2,
    z + offset.z - cols / 2,
  ];
}
