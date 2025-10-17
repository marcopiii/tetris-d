import * as THREE from 'three';
import { colors } from '~/materials/colors';

export const tetrionMaterial = new THREE.LineBasicMaterial({
  color: colors.tetrion,
  transparent: true,
  opacity: 0.5,
});
