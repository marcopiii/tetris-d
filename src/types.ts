import * as THREE from 'three';

export type Command =
  | 'hold'
  | 'rotateL'
  | 'rotateR'
  | 'shiftL'
  | 'shiftR'
  | 'shiftF'
  | 'shiftB'
  | 'hardDrop';

export type Position =
  | 'xR_zR'
  | 'xL_zR'
  | 'xL_zL'
  | 'xR_zL'
  | 'x0_zR'
  | 'x0_zL'
  | 'xR_z0'
  | 'xL_z0';

export type CameraConfiguration = {
  position: THREE.Vector3;
  lookAt: THREE.Vector3;
};
