import { Name } from '../../tetrimino';
import { colors } from '../../theme';
import { adjustBrightness as adj } from '../utils';
import * as THREE from 'three';

const k = 20;

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

export const minoMaterials: {
  normal: Record<Name, TriMaterial>;
  shade: Record<Name, THREE.MeshBasicMaterialParameters>;
  disabled: TriMaterial;
  deleting: THREE.MeshBasicMaterialParameters;
} = {
  normal: {
    I: [
      { color: colors.tetrimino.I },
      { color: adj(colors.tetrimino.I, k) },
      { color: adj(colors.tetrimino.I, -k) },
    ],
    O: [
      { color: colors.tetrimino.O },
      { color: adj(colors.tetrimino.O, k) },
      { color: adj(colors.tetrimino.O, -k) },
    ],
    T: [
      { color: colors.tetrimino.T },
      { color: adj(colors.tetrimino.T, k) },
      { color: adj(colors.tetrimino.T, -k) },
    ],
    J: [
      { color: colors.tetrimino.J },
      { color: adj(colors.tetrimino.J, k) },
      { color: adj(colors.tetrimino.J, -k) },
    ],
    L: [
      { color: colors.tetrimino.L },
      { color: adj(colors.tetrimino.L, k) },
      { color: adj(colors.tetrimino.L, -k) },
    ],
    S: [
      { color: colors.tetrimino.S },
      { color: adj(colors.tetrimino.S, k) },
      { color: adj(colors.tetrimino.S, -k) },
    ],
    Z: [
      { color: colors.tetrimino.Z },
      { color: adj(colors.tetrimino.Z, k) },
      { color: adj(colors.tetrimino.Z, -k) },
    ],
  },
  shade: {
    I: {
      color: colors.tetrimino.I,
      transparent: true,
      opacity: 0.5,
      fog: false,
    },
    O: {
      color: colors.tetrimino.O,
      transparent: true,
      opacity: 0.5,
      fog: false,
    },
    T: {
      color: colors.tetrimino.T,
      transparent: true,
      opacity: 0.5,
      fog: false,
    },
    J: {
      color: colors.tetrimino.J,
      transparent: true,
      opacity: 0.5,
      fog: false,
    },
    L: {
      color: colors.tetrimino.L,
      transparent: true,
      opacity: 0.5,
      fog: false,
    },
    S: {
      color: colors.tetrimino.S,
      transparent: true,
      opacity: 0.5,
      fog: false,
    },
    Z: {
      color: colors.tetrimino.Z,
      transparent: true,
      opacity: 0.5,
      fog: false,
    },
  },
  disabled: [
    { color: colors.disabled },
    { color: adj(colors.disabled, k) },
    { color: adj(colors.disabled, -k) },
  ],
  deleting: {
    color: new THREE.Color(1.01, 1.01, 1.01),
    fog: false,
  },
};
