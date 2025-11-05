import { useThree } from '@react-three/fiber';
import React from 'react';
import * as THREE from 'three';
import { COLS, ROWS } from '~/scene/Play/Game/params';
import { MINO_SIZE } from '~/scene/shared';
import TetrionWall from './TetrionWall';

export default function Tetrion() {
  const scene = useThree((rootState) => rootState.scene);

  React.useEffect(() => {
    scene.fog = new THREE.Fog('black', 10, 50);
    scene.background = new THREE.Color('#b5c5d2');
    return () => {
      scene.fog = null;
      scene.background = null;
    };
  }, [scene]);

  return (
    <group>
      <gridHelper
        args={[COLS * MINO_SIZE, COLS, '#8797a4', '#8797a4']}
        position={[0, -ROWS / 2, 0]}
      />
      <TetrionWall position={[COLS / 2, 0, 0]} rotation={[0, Math.PI / 2, 0]} />
      <TetrionWall
        position={[-COLS / 2, 0, 0]}
        rotation={[0, -Math.PI / 2, 0]}
      />
      <TetrionWall position={[0, 0, -COLS / 2]} rotation={[0, 0, 0]} />
      <TetrionWall position={[0, 0, COLS / 2]} rotation={[0, Math.PI, 0]} />
    </group>
  );
}
