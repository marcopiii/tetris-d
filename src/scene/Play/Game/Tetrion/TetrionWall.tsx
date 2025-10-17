import React from 'react';
import * as THREE from 'three';
import { tetrionMaterial } from '~/materials';
import { MINO_SIZE } from '~/scene/shared';
import { COLS, ROWS } from '../params';

const tetrionWallGeometry = new THREE.PlaneGeometry(
  COLS * MINO_SIZE,
  ROWS * MINO_SIZE,
);

export default function TetrionWall(props: {
  position: [number, number, number];
  rotation?: [number, number, number];
}) {
  return (
    <lineSegments position={props.position} rotation={props.rotation}>
      <edgesGeometry attach="geometry" args={[tetrionWallGeometry]} />
      <lineBasicMaterial attach="material" {...tetrionMaterial} />
    </lineSegments>
  );
}
