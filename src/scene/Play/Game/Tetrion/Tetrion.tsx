import { useThree } from '@react-three/fiber';
import React from 'react';
import * as THREE from 'three';
import { match } from 'ts-pattern';
import { colors } from '~/materials/colors';
import { COLS, ROWS } from '~/scene/Play/Game/params';
import { Plane } from '~/scene/Play/Game/types';
import { translate } from '~/scene/Play/Game/utils';
import { MINO_SIZE } from '~/scene/shared';
import TetrionWall from './TetrionWall';

type Props = {
  activePlane: {
    type: Plane;
    i: number;
  };
};

export default function Tetrion(props: Props) {
  const scene = useThree((rootState) => rootState.scene);

  React.useEffect(() => {
    scene.fog = new THREE.Fog('#000000', 10, 50);
    return () => {
      scene.fog = null;
      scene.background = null;
    };
  }, [scene]);

  const [posFw, posBw, rot] = match(props.activePlane)
    .with({ type: 'x' }, ({ i }) => {
      const [x] = translate(i, 0, 0);
      const posFw = [x + MINO_SIZE / 2, 0, 0] satisfies THREE.Vector3Tuple;
      const posBw = [x - MINO_SIZE / 2, 0, 0] satisfies THREE.Vector3Tuple;
      const rot = [0, Math.PI / 2, 0] satisfies THREE.EulerTuple;
      return [posFw, posBw, rot] as const;
    })
    .with({ type: 'z' }, ({ i }) => {
      const [, , z] = translate(0, 0, i);
      const posFw = [0, 0, z + MINO_SIZE / 2] satisfies THREE.Vector3Tuple;
      const posBw = [0, 0, z - MINO_SIZE / 2] satisfies THREE.Vector3Tuple;
      const rot = [0, 0, 0] satisfies THREE.EulerTuple;
      return [posFw, posBw, rot] as const;
    })
    .exhaustive();

  return (
    <group>
      <axesHelper args={[5]} />
      <gridHelper
        args={[COLS * MINO_SIZE, COLS, colors.tetrion, colors.tetrion]}
        position={[0, -ROWS / 2, 0]}
      />
      <TetrionWall position={[COLS / 2, 0, 0]} rotation={[0, Math.PI / 2, 0]} />
      <TetrionWall
        position={[-COLS / 2, 0, 0]}
        rotation={[0, -Math.PI / 2, 0]}
      />
      <TetrionWall position={[0, 0, -COLS / 2]} rotation={[0, 0, 0]} />
      <TetrionWall position={[0, 0, COLS / 2]} rotation={[0, Math.PI, 0]} />
      <TetrionWall position={posFw} rotation={rot} />
      <TetrionWall position={posBw} rotation={rot} />
    </group>
  );
}
