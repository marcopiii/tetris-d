import { Tetrimino } from '~/tetrimino';
import { adjustBrightness as adj } from './adjustBrightness';
import * as THREE from 'three';
import { colors } from './colors';
import { TriMaterial } from './types';

const k = 20;
const j = 80;

const deletingMaterialProps = {
  color: new THREE.Color(2, 2, 2),
  fog: false,
};

const ghostMaterialProps = {
  transparent: true,
  opacity: 0.5,
  fog: false,
};

export const minoMaterials: Record<
  Tetrimino,
  {
    normal: TriMaterial;
    shade: THREE.MeshBasicMaterialParameters;
    disabled: TriMaterial;
    deleting: TriMaterial;
    ghost: TriMaterial;
  }
> = {
  I: {
    normal: [
      { color: colors.tetrimino.I },
      { color: adj(colors.tetrimino.I, k) },
      { color: adj(colors.tetrimino.I, -k) },
    ],
    shade: {
      color: adj(colors.tetrimino.I, -j),
      fog: false,
    },
    disabled: [
      { color: colors.disabled },
      { color: adj(colors.disabled, k) },
      { color: adj(colors.disabled, -k) },
    ],
    deleting: [
      deletingMaterialProps,
      deletingMaterialProps,
      deletingMaterialProps,
    ],
    ghost: [
      { color: colors.tetrimino.I, ...ghostMaterialProps },
      { color: adj(colors.tetrimino.I, k), ...ghostMaterialProps },
      { color: adj(colors.tetrimino.I, -k), ...ghostMaterialProps },
    ],
  },
  O: {
    normal: [
      { color: colors.tetrimino.O },
      { color: adj(colors.tetrimino.O, k) },
      { color: adj(colors.tetrimino.O, -k) },
    ],
    shade: {
      color: adj(colors.tetrimino.O, -j),
      fog: false,
    },
    disabled: [
      { color: colors.disabled },
      { color: adj(colors.disabled, k) },
      { color: adj(colors.disabled, -k) },
    ],
    deleting: [
      deletingMaterialProps,
      deletingMaterialProps,
      deletingMaterialProps,
    ],
    ghost: [
      { color: colors.tetrimino.O, ...ghostMaterialProps },
      { color: adj(colors.tetrimino.O, k), ...ghostMaterialProps },
      { color: adj(colors.tetrimino.O, -k), ...ghostMaterialProps },
    ],
  },
  T: {
    normal: [
      { color: colors.tetrimino.T },
      { color: adj(colors.tetrimino.T, k) },
      { color: adj(colors.tetrimino.T, -k) },
    ],
    shade: {
      color: adj(colors.tetrimino.T, -j),
      fog: false,
    },
    disabled: [
      { color: colors.disabled },
      { color: adj(colors.disabled, k) },
      { color: adj(colors.disabled, -k) },
    ],
    deleting: [
      deletingMaterialProps,
      deletingMaterialProps,
      deletingMaterialProps,
    ],
    ghost: [
      { color: colors.tetrimino.T, ...ghostMaterialProps },
      { color: adj(colors.tetrimino.T, k), ...ghostMaterialProps },
      { color: adj(colors.tetrimino.T, -k), ...ghostMaterialProps },
    ],
  },
  J: {
    normal: [
      { color: colors.tetrimino.J },
      { color: adj(colors.tetrimino.J, k) },
      { color: adj(colors.tetrimino.J, -k) },
    ],
    shade: {
      color: adj(colors.tetrimino.J, -j),
      fog: false,
    },
    disabled: [
      { color: colors.disabled },
      { color: adj(colors.disabled, k) },
      { color: adj(colors.disabled, -k) },
    ],
    deleting: [
      deletingMaterialProps,
      deletingMaterialProps,
      deletingMaterialProps,
    ],
    ghost: [
      { color: colors.tetrimino.J, ...ghostMaterialProps },
      { color: adj(colors.tetrimino.J, k), ...ghostMaterialProps },
      { color: adj(colors.tetrimino.J, -k), ...ghostMaterialProps },
    ],
  },
  L: {
    normal: [
      { color: colors.tetrimino.L },
      { color: adj(colors.tetrimino.L, k) },
      { color: adj(colors.tetrimino.L, -k) },
    ],
    shade: {
      color: adj(colors.tetrimino.L, -j),
      fog: false,
    },
    disabled: [
      { color: colors.disabled },
      { color: adj(colors.disabled, k) },
      { color: adj(colors.disabled, -k) },
    ],
    deleting: [
      deletingMaterialProps,
      deletingMaterialProps,
      deletingMaterialProps,
    ],
    ghost: [
      { color: colors.tetrimino.L, ...ghostMaterialProps },
      { color: adj(colors.tetrimino.L, k), ...ghostMaterialProps },
      { color: adj(colors.tetrimino.L, -k), ...ghostMaterialProps },
    ],
  },
  S: {
    normal: [
      { color: colors.tetrimino.S },
      { color: adj(colors.tetrimino.S, k) },
      { color: adj(colors.tetrimino.S, -k) },
    ],
    shade: {
      color: adj(colors.tetrimino.S, -j),
      fog: false,
    },
    disabled: [
      { color: colors.disabled },
      { color: adj(colors.disabled, k) },
      { color: adj(colors.disabled, -k) },
    ],
    deleting: [
      deletingMaterialProps,
      deletingMaterialProps,
      deletingMaterialProps,
    ],
    ghost: [
      { color: colors.tetrimino.S, ...ghostMaterialProps },
      { color: adj(colors.tetrimino.S, k), ...ghostMaterialProps },
      { color: adj(colors.tetrimino.S, -k), ...ghostMaterialProps },
    ],
  },
  Z: {
    normal: [
      { color: colors.tetrimino.Z },
      { color: adj(colors.tetrimino.Z, k) },
      { color: adj(colors.tetrimino.Z, -k) },
    ],
    shade: {
      color: adj(colors.tetrimino.Z, -j),
      fog: false,
    },
    disabled: [
      { color: colors.disabled },
      { color: adj(colors.disabled, k) },
      { color: adj(colors.disabled, -k) },
    ],
    deleting: [
      deletingMaterialProps,
      deletingMaterialProps,
      deletingMaterialProps,
    ],
    ghost: [
      { color: colors.tetrimino.Z, ...ghostMaterialProps },
      { color: adj(colors.tetrimino.Z, k), ...ghostMaterialProps },
      { color: adj(colors.tetrimino.Z, -k), ...ghostMaterialProps },
    ],
  },
};
