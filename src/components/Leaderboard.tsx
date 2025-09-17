import { Center } from '@react-three/drei';
import React from 'react';
import { match } from 'ts-pattern';
import { VOXEL_SIZE } from '../params';
import R3FWord from './R3FWord';
import useCamera from './useCamera';
import useGamepadManager from './useGamepadManager';
import { useKeyboardManager } from './useKeyboardManager';

export default function Leaderboard() {
  const [camera, setCamera] = useCamera({
    left: { position: [-10, 4, 10], lookAt: [0, 0, 0] },
    right: { position: [10, 4, 10], lookAt: [0, 0, 0] },
  });

  const menuCameraHandler = React.useCallback(
    (command: 'moveL' | 'moveR'): void =>
      match([camera, command])
        .with(['right', 'moveL'], () => setCamera('left'))
        .with(['left', 'moveR'], () => setCamera('right'))
        .otherwise(() => {}),
    [camera],
  );

  useKeyboardManager(
    React.useCallback(
      (event, button) =>
        match([event, button])
          .with(['press', 'ArrowLeft'], () => menuCameraHandler('moveL'))
          .with(['press', 'ArrowRight'], () => menuCameraHandler('moveR'))
          .otherwise(() => {}),
      [menuCameraHandler],
    ),
  );

  useGamepadManager(
    React.useCallback(
      (event, button) =>
        match([event, button])
          .with(['press', 'LT'], () => menuCameraHandler('moveL'))
          .with(['press', 'RT'], () => menuCameraHandler('moveR'))
          .otherwise(() => {}),
      [menuCameraHandler],
    ),
  );

  return (
    <group position={[0, 8, 0]}>
      <R3FWord
        text="Leaderboard"
        type="main"
        font="alphabet"
        alignX="center"
        position={[0, 0, 0]}
      />
      <Center position={[0, -3, 0]}>
        <R3FWord
          text="rank"
          type="primary"
          font="alphabet"
          alignX="center"
          position={[-11, 0, 0]}
        />
        <R3FWord
          text="name"
          type="primary"
          font="alphabet"
          alignX="center"
          position={[-4, -VOXEL_SIZE.primary, 0]}
        />
        <R3FWord
          text="score"
          type="primary"
          font="alphabet"
          alignX="center"
          position={[4, -VOXEL_SIZE.primary, 0]}
        />
        <R3FWord
          text="lvl"
          type="primary"
          font="alphabet"
          alignX="center"
          position={[11, 0, 0]}
        />
      </Center>
    </group>
  );
}
