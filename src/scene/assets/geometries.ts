import * as THREE from 'three';
import { COLS, MINO_SIZE, ROWS, VOXEL_SIZE } from '../../params';

/** geometry used to represent a mino */
export const minoGeometry = new THREE.BoxGeometry(
  MINO_SIZE,
  MINO_SIZE,
  MINO_SIZE,
);

/** geometry used to represent a mino shade */
export const minoShadeGeometry = new THREE.PlaneGeometry(MINO_SIZE, MINO_SIZE);

/** geometries used to represent voxels */
export const voxelGeometries = {
  primary: new THREE.BoxGeometry(
    VOXEL_SIZE.primary,
    VOXEL_SIZE.primary,
    VOXEL_SIZE.primary,
  ),
  secondary: new THREE.BoxGeometry(
    VOXEL_SIZE.secondary,
    VOXEL_SIZE.secondary,
    VOXEL_SIZE.secondary,
  ),
};

export const tetrionWallGeometry = new THREE.EdgesGeometry(
  new THREE.PlaneGeometry(COLS * MINO_SIZE, ROWS * MINO_SIZE),
);
