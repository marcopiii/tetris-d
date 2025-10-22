import React from 'react';
import * as THREE from 'three';
import { tetrionMaterial } from '~/materials';
import { COLS, ROWS } from '~/scene/Play/Game/params';
import { MINO_SIZE } from '~/scene/shared';

const tetrionBaseGeometry = new THREE.ConeGeometry(
  (COLS * MINO_SIZE) / Math.sqrt(2),
  ROWS * MINO_SIZE,
  4,
);

export default function TetrionBase(props: {
  position: [number, number, number];
  rotation: [number, number, number];
}) {
  return (
    <mesh
      geometry={tetrionBaseGeometry}
      position={props.position}
      rotation={props.rotation}
    >
      <meshBasicMaterial attach="material" {...tetrionMaterial} />
    </mesh>
  );
}
