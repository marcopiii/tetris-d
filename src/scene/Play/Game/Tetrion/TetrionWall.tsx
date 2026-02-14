import React from 'react';
import * as THREE from 'three';
import { tetrionMaterial } from '~/materials';
import { MINO_SIZE } from '~/scene/shared';
import { useGameParams } from '../params';

export default function TetrionWall(props: {
  position: [number, number, number];
  rotation?: [number, number, number];
}) {
  const { cols, rows } = useGameParams();

  const geometry = React.useMemo(
    () => new THREE.PlaneGeometry(cols * MINO_SIZE, rows * MINO_SIZE),
    [cols, rows],
  );

  return (
    <lineSegments position={props.position} rotation={props.rotation}>
      <edgesGeometry attach="geometry" args={[geometry]} />
      <lineBasicMaterial attach="material" {...tetrionMaterial} />
    </lineSegments>
  );
}
