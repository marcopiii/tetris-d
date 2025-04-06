import * as THREE from 'three';
import { MINO_SIZE } from '../params';
import { Position } from './types';

type CameraSetup = {
  position: THREE.Vector3;
  lookAt: THREE.Vector3;
};

export const cameraSetup: Record<Position, CameraSetup> = {
  xR_zR: {
    position: new THREE.Vector3(-10, 5, 10 + MINO_SIZE),
    lookAt: new THREE.Vector3(0, 0, MINO_SIZE),
  },
  xR_zL: {
    position: new THREE.Vector3(10, 5, 10 + MINO_SIZE),
    lookAt: new THREE.Vector3(0, 0, MINO_SIZE),
  },
  xL_zL: {
    position: new THREE.Vector3(10, 4, -10 + MINO_SIZE),
    lookAt: new THREE.Vector3(0, -1, +MINO_SIZE),
  },
  xL_zR: {
    position: new THREE.Vector3(-10, 5, -10 - MINO_SIZE),
    lookAt: new THREE.Vector3(0, 0, -MINO_SIZE),
  },
};
