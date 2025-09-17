import { Center } from '@react-three/drei';
import React from 'react';
import { match } from 'ts-pattern';
import { VOXEL_SIZE } from '../params';
import R3FWord from './R3FWord';
import useCamera from './useCamera';
import useGamepadManager from './useGamepadManager';
import { useKeyboardManager } from './useKeyboardManager';
import { useLocalStorage } from '@uidotdev/usehooks';

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

  const [leaderboard] = useLocalStorage<
    { name: string; score: number; level: number }[]
  >('t3d-leaderboard', []);

  return (
    <group position={[0, 8, 0]}>
      <R3FWord
        text="Leaderboard"
        type="main"
        font="alphabet"
        alignX="center"
        position={[0, 0, 0]}
      />
      <Center position={[0, -2.5, 0]}>
        <R3FWord
          text="#"
          type="half"
          font="alphabet"
          alignX="center"
          position={[-8, 0, 0]}
        />
        <R3FWord
          text="name"
          type="half"
          font="alphabet"
          alignX="center"
          position={[-3.5, -VOXEL_SIZE.primary, 0]}
        />
        <R3FWord
          text="score"
          type="half"
          font="alphabet"
          alignX="center"
          position={[3.5, -VOXEL_SIZE.primary, 0]}
        />
        <R3FWord
          text="lvl"
          type="half"
          font="alphabet"
          alignX="center"
          position={[9, 0, 0]}
        />
      </Center>
      {leaderboard
        .sort((a, b) => b.score - a.score)
        .slice(0, 9)
        .map((entry, idx) => (
          <Center key={idx} position={[0, -4.5 - idx * 1.25, 0]}>
            <R3FWord
              text={`${idx + 1}`}
              type="secondary"
              font="numbers"
              alignX="center"
              position={[-8, 0, 0]}
            />
            <R3FWord
              text={entry.name}
              type="secondary"
              font="alphabet"
              alignX="center"
              position={[-3.5, 0, 0]}
            />
            <R3FWord
              text={entry.score.toString()}
              type="secondary"
              font="numbers"
              alignX="center"
              position={[3.5, 0, 0]}
            />
            <R3FWord
              text={entry.level.toString()}
              type="secondary"
              font="numbers"
              alignX="center"
              position={[9, 0, 0]}
            />
          </Center>
        ))}
    </group>
  );
}
