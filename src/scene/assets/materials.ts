import * as THREE from 'three';
import { adjustBrightness as adj } from '../utils';
import { colors } from '../../theme';

const k = 20;
const j = 80;

export const minoMaterials = {
  I: {
    x: new THREE.MeshBasicMaterial({ color: colors.tetrimino.I }),
    y: new THREE.MeshBasicMaterial({ color: adj(colors.tetrimino.I, k) }),
    z: new THREE.MeshBasicMaterial({ color: adj(colors.tetrimino.I, -k) }),
  },
  O: {
    x: new THREE.MeshBasicMaterial({ color: colors.tetrimino.O }),
    y: new THREE.MeshBasicMaterial({ color: adj(colors.tetrimino.O, k) }),
    z: new THREE.MeshBasicMaterial({ color: adj(colors.tetrimino.O, -k) }),
  },
  T: {
    x: new THREE.MeshBasicMaterial({ color: colors.tetrimino.T }),
    y: new THREE.MeshBasicMaterial({ color: adj(colors.tetrimino.T, k) }),
    z: new THREE.MeshBasicMaterial({ color: adj(colors.tetrimino.T, -k) }),
  },
  J: {
    x: new THREE.MeshBasicMaterial({ color: colors.tetrimino.J }),
    y: new THREE.MeshBasicMaterial({ color: adj(colors.tetrimino.J, k) }),
    z: new THREE.MeshBasicMaterial({ color: adj(colors.tetrimino.J, -k) }),
  },
  L: {
    x: new THREE.MeshBasicMaterial({ color: colors.tetrimino.L }),
    y: new THREE.MeshBasicMaterial({ color: adj(colors.tetrimino.L, k) }),
    z: new THREE.MeshBasicMaterial({ color: adj(colors.tetrimino.L, -k) }),
  },
  S: {
    x: new THREE.MeshBasicMaterial({ color: colors.tetrimino.S }),
    y: new THREE.MeshBasicMaterial({ color: adj(colors.tetrimino.S, k) }),
    z: new THREE.MeshBasicMaterial({ color: adj(colors.tetrimino.S, -k) }),
  },
  Z: {
    x: new THREE.MeshBasicMaterial({ color: colors.tetrimino.Z }),
    y: new THREE.MeshBasicMaterial({ color: adj(colors.tetrimino.Z, k) }),
    z: new THREE.MeshBasicMaterial({ color: adj(colors.tetrimino.Z, -k) }),
  },
  disabled: {
    x: new THREE.MeshBasicMaterial({ color: colors.disabled }),
    y: new THREE.MeshBasicMaterial({ color: adj(colors.disabled, k) }),
    z: new THREE.MeshBasicMaterial({ color: adj(colors.disabled, -k) }),
  },
};

export const minoShadeMaterials = {
  I: new THREE.MeshBasicMaterial({
    color: adj(colors.tetrimino.I, -j),
    fog: false,
  }),
  O: new THREE.MeshBasicMaterial({
    color: adj(colors.tetrimino.O, -j),
    fog: false,
  }),
  T: new THREE.MeshBasicMaterial({
    color: adj(colors.tetrimino.T, -j),
    fog: false,
  }),
  J: new THREE.MeshBasicMaterial({
    color: adj(colors.tetrimino.J, -j),
    fog: false,
  }),
  L: new THREE.MeshBasicMaterial({
    color: adj(colors.tetrimino.L, -j),
    fog: false,
  }),
  S: new THREE.MeshBasicMaterial({
    color: adj(colors.tetrimino.S, -j),
    fog: false,
  }),
  Z: new THREE.MeshBasicMaterial({
    color: adj(colors.tetrimino.Z, -j),
    fog: false,
  }),
};

export const minoTransMaterials = {
  I: new THREE.MeshBasicMaterial({
    color: colors.tetrimino.I,
    transparent: true,
    opacity: 0.5,
    fog: false,
  }),
  O: new THREE.MeshBasicMaterial({
    color: colors.tetrimino.O,
    transparent: true,
    opacity: 0.5,
    fog: false,
  }),
  T: new THREE.MeshBasicMaterial({
    color: colors.tetrimino.T,
    transparent: true,
    opacity: 0.5,
    fog: false,
  }),
  J: new THREE.MeshBasicMaterial({
    color: colors.tetrimino.J,
    transparent: true,
    opacity: 0.5,
    fog: false,
  }),
  L: new THREE.MeshBasicMaterial({
    color: colors.tetrimino.L,
    transparent: true,
    opacity: 0.5,
    fog: false,
  }),
  S: new THREE.MeshBasicMaterial({
    color: colors.tetrimino.S,
    transparent: true,
    opacity: 0.5,
    fog: false,
  }),
  Z: new THREE.MeshBasicMaterial({
    color: colors.tetrimino.Z,
    transparent: true,
    opacity: 0.5,
    fog: false,
  }),
};

export const voxelMaterials = {
  primary: {
    x: new THREE.MeshBasicMaterial({ color: colors.text.primary, fog: false }),
    y: new THREE.MeshBasicMaterial({
      color: adj(colors.text.primary, k),
      fog: false,
    }),
    z: new THREE.MeshBasicMaterial({
      color: adj(colors.text.primary, -k),
      fog: false,
    }),
  },
  secondary: {
    x: new THREE.MeshBasicMaterial({
      color: colors.text.secondary,
      fog: false,
    }),
    y: new THREE.MeshBasicMaterial({
      color: adj(colors.text.secondary, k),
      fog: false,
    }),
    z: new THREE.MeshBasicMaterial({
      color: adj(colors.text.secondary, -k),
      fog: false,
    }),
  },
  main: {
    x: new THREE.MeshBasicMaterial({ color: colors.text.main, fog: false }),
    y: new THREE.MeshBasicMaterial({
      color: adj(colors.text.main, k),
      fog: false,
    }),
    z: new THREE.MeshBasicMaterial({
      color: adj(colors.text.main, -k),
      fog: false,
    }),
  },
  disabled: {
    x: new THREE.MeshBasicMaterial({ color: colors.disabled, fog: false }),
    y: new THREE.MeshBasicMaterial({
      color: adj(colors.disabled, k),
      fog: false,
    }),
    z: new THREE.MeshBasicMaterial({
      color: adj(colors.disabled, -k),
      fog: false,
    }),
  },
};

export const bloomingMaterial = new THREE.MeshBasicMaterial({
  color: new THREE.Color(1.01, 1.01, 1.01),
  fog: false,
});

export const tetrionMaterial = new THREE.LineBasicMaterial({
  color: '#8797a4',
  transparent: true,
  opacity: 0.5,
});

export const cuttingShadowMaterial = new THREE.MeshBasicMaterial({
  color: adj(colors.disabled, -60),
});
