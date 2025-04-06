import * as THREE from 'three';
import { MINO_SIZE } from '../params';
import { Position } from './types';

type CameraSetup = {
  position: THREE.Vector3;
  lookAt: THREE.Vector3;
};

export const cameraSetup: Record<Position, CameraSetup> = {
  c1: {
    position: new THREE.Vector3(-10, 5, 10 + MINO_SIZE),
    lookAt: new THREE.Vector3(0, 0, MINO_SIZE),
  },
  c2: {
    position: new THREE.Vector3(10, 5, 10 + MINO_SIZE),
    lookAt: new THREE.Vector3(0, 0, MINO_SIZE),
  },
  c3: {
    position: new THREE.Vector3(10, 4, -10 + MINO_SIZE),
    lookAt: new THREE.Vector3(0, -1, +MINO_SIZE),
  },
  c4: {
    position: new THREE.Vector3(-10, 5, -10 - MINO_SIZE),
    lookAt: new THREE.Vector3(0, 0, -MINO_SIZE),
  },
};
