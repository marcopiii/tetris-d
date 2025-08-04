import { Name } from '../../tetrimino';
import { colors } from '../../theme';
import { adjustBrightness as adj } from '../utils';
import * as THREE from 'three';

const k = 20;
const j = 80;

export const voxelMaterials: Record<
  'main' | 'primary' | 'secondary' | 'disabled',
  [
    THREE.MeshBasicMaterialParameters,
    THREE.MeshBasicMaterialParameters,
    THREE.MeshBasicMaterialParameters,
  ]
> = {
  primary: [
    { color: colors.text.primary, fog: false },
    { color: adj(colors.text.primary, k), fog: false },
    { color: adj(colors.text.primary, -k), fog: false },
  ],
  secondary: [
    { color: colors.text.secondary, fog: false },
    { color: adj(colors.text.secondary, k), fog: false },
    { color: adj(colors.text.secondary, -k), fog: false },
  ],
  main: [
    { color: colors.text.main, fog: false },
    { color: adj(colors.text.main, k), fog: false },
    { color: adj(colors.text.main, -k), fog: false },
  ],
  disabled: [
    { color: colors.disabled, fog: false },
    { color: adj(colors.disabled, k), fog: false },
    { color: adj(colors.disabled, -k), fog: false },
  ],
};

export type TriMaterial = [
  THREE.MeshBasicMaterialParameters,
  THREE.MeshBasicMaterialParameters,
  THREE.MeshBasicMaterialParameters,
];

type MinoState = 'normal' | 'shade' | 'disabled' | 'deleting';

const deletingMaterialProps = {
  color: new THREE.Color(1.01, 1.01, 1.01),
  fog: false,
};

export const minoMaterials: Record<
  Name,
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
      {
        color: colors.tetrimino.I,
        transparent: true,
        opacity: 0.5,
        fog: false,
      },
      {
        color: colors.tetrimino.I,
        transparent: true,
        opacity: 0.5,
        fog: false,
      },
      {
        color: colors.tetrimino.I,
        transparent: true,
        opacity: 0.5,
        fog: false,
      },
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
      {
        color: colors.tetrimino.O,
        transparent: true,
        opacity: 0.5,
        fog: false,
      },
      {
        color: colors.tetrimino.O,
        transparent: true,
        opacity: 0.5,
        fog: false,
      },
      {
        color: colors.tetrimino.O,
        transparent: true,
        opacity: 0.5,
        fog: false,
      },
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
      {
        color: colors.tetrimino.T,
        transparent: true,
        opacity: 0.5,
        fog: false,
      },
      {
        color: colors.tetrimino.T,
        transparent: true,
        opacity: 0.5,
        fog: false,
      },
      {
        color: colors.tetrimino.T,
        transparent: true,
        opacity: 0.5,
        fog: false,
      },
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
      {
        color: colors.tetrimino.J,
        transparent: true,
        opacity: 0.5,
        fog: false,
      },
      {
        color: colors.tetrimino.J,
        transparent: true,
        opacity: 0.5,
        fog: false,
      },
      {
        color: colors.tetrimino.J,
        transparent: true,
        opacity: 0.5,
        fog: false,
      },
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
      {
        color: colors.tetrimino.L,
        transparent: true,
        opacity: 0.5,
        fog: false,
      },
      {
        color: colors.tetrimino.L,
        transparent: true,
        opacity: 0.5,
        fog: false,
      },
      {
        color: colors.tetrimino.L,
        transparent: true,
        opacity: 0.5,
        fog: false,
      },
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
      {
        color: colors.tetrimino.S,
        transparent: true,
        opacity: 0.5,
        fog: false,
      },
      {
        color: colors.tetrimino.S,
        transparent: true,
        opacity: 0.5,
        fog: false,
      },
      {
        color: colors.tetrimino.S,
        transparent: true,
        opacity: 0.5,
        fog: false,
      },
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
      {
        color: colors.tetrimino.Z,
        transparent: true,
        opacity: 0.5,
        fog: false,
      },
      {
        color: colors.tetrimino.Z,
        transparent: true,
        opacity: 0.5,
        fog: false,
      },
      {
        color: colors.tetrimino.Z,
        transparent: true,
        opacity: 0.5,
        fog: false,
      },
    ],
  },
};
