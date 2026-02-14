import { useThree } from '@react-three/fiber';
import React from 'react';
import * as THREE from 'three';
import { colors } from '~/materials/colors';
import { useGameParams } from '~/scene/Play/Game/params';
import { MINO_SIZE } from '~/scene/shared';
import TetrionWall from './TetrionWall';

export default function Tetrion() {
  const { cols, rows } = useGameParams();
  const scene = useThree((rootState) => rootState.scene);

  React.useEffect(() => {
    scene.fog = new THREE.Fog('#000000', 10, 50);
    return () => {
      scene.fog = null;
      scene.background = null;
    };
  }, [scene]);

  return (
    <group>
      <gridHelper
        args={[cols * MINO_SIZE, cols, colors.tetrion, colors.tetrion]}
        position={[0, -rows / 2, 0]}
      />
      <TetrionWall position={[cols / 2, 0, 0]} rotation={[0, Math.PI / 2, 0]} />
      <TetrionWall
        position={[-cols / 2, 0, 0]}
        rotation={[0, -Math.PI / 2, 0]}
      />
      <TetrionWall position={[0, 0, -cols / 2]} rotation={[0, 0, 0]} />
      <TetrionWall position={[0, 0, cols / 2]} rotation={[0, Math.PI, 0]} />
    </group>
  );
}
