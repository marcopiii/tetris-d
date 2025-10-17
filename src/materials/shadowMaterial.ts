import * as THREE from 'three';
import { adjustBrightness as adj } from './adjustBrightness';
import { colors } from './colors';

export const cuttingShadowMaterial: THREE.MeshBasicMaterialParameters = {
  color: adj(colors.disabled, -60),
};
