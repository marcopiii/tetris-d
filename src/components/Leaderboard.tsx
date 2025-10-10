import { Center } from '@react-three/drei';
import React from 'react';
import { match } from 'ts-pattern';
import { VOXEL_SIZE } from '../params';
import R3FWord from './R3FWord';
import useCamera from './useCamera';
import useGamepadManager from './useGamepadManager';
import useKeyboardManager from './useKeyboardManager';
import { useLocalStorage } from '@uidotdev/usehooks';

type Props = { onBack: () => void } & (
  | {
      gameOver: true;
      newScore: number;
      newLevel: number;
    }
  | { gameOver?: never }
);

export default function Leaderboard(props: Props) {
  const [camera, setCamera] = useCamera({
    left: { position: [-10, 4, 10], lookAt: [0, 0, 0] },
    right: { position: [10, 4, 10], lookAt: [0, 0, 0] },
  });

  const cameraHandler = (command: 'moveL' | 'moveR'): void =>
    match([camera, command])
      .with(['right', 'moveL'], () => setCamera('left'))
      .with(['left', 'moveR'], () => setCamera('right'))
      .otherwise(() => {});

  const [leaderboard] = useLocalStorage<
    { name: string; score: number; level: number }[]
  >('t3d-leaderboard', []);

  const [handle, setHandle] = React.useState('_');

  const entries = (
    props.gameOver
      ? [
          {
            score: props.newScore,
            level: props.newLevel,
            name: handle,
            editing: true,
          },
          ...leaderboard.map((e) => ({ ...e, editing: false })),
        ]
      : leaderboard.map((e) => ({ ...e, editing: false }))
  )
    .sort((a, b) => b.score - a.score)
    .map((e, i) => ({ rank: i + 1, ...e }));

  const top9 = entries.slice(0, 9);

  const visibleEntries = props.gameOver
    ? top9.some((e) => e.editing)
      ? top9
      : entries.filter((e) => e.rank <= 9 || e.editing)
    : top9;

  useKeyboardManager((event, button) =>
    match([event, button])
      .with(['press', 'ArrowLeft'], () => cameraHandler('moveL'))
      .with(['press', 'ArrowRight'], () => cameraHandler('moveR'))
      .with(['press', 'Escape'], () => props.onBack())
      // todo: handle name input when inserting
      .otherwise(() => {}),
  );

  useGamepadManager((event, button) =>
    match([event, button])
      .with(['press', 'LT'], () => cameraHandler('moveL'))
      .with(['press', 'RT'], () => cameraHandler('moveR'))
      .otherwise(() => {}),
  );

  return (
    <group position={[0, 8, 0]}>
      <R3FWord
        text={props.gameOver ? 'game over' : 'Leaderboard'}
        type="main"
        font="alphabet"
        alignX="center"
        position={[0, 0, 0]}
      />
      <Center position={[0, -2.5, 0]}>
        <R3FWord
          text="#"
          type="primary-half"
          font="alphabet"
          alignX="center"
          position={[-8, 0, 0]}
        />
        <R3FWord
          text="name"
          type="primary-half"
          font="alphabet"
          alignX="center"
          position={[-3.5, -VOXEL_SIZE.primary, 0]}
        />
        <R3FWord
          text="score"
          type="primary-half"
          font="alphabet"
          alignX="center"
          position={[3.5, -VOXEL_SIZE.primary, 0]}
        />
        <R3FWord
          text="lvl"
          type="primary-half"
          font="alphabet"
          alignX="center"
          position={[9, 0, 0]}
        />
      </Center>
      {visibleEntries.map((entry, idx) => (
        <Center key={idx} position={[0, -4.5 - idx * 1.25, 0]}>
          <R3FWord
            text={entry.rank.toString()}
            type={entry.editing ? 'secondary-half' : 'secondary'}
            font="numbers"
            position={[-8, 0, 0]}
          />
          <R3FWord
            text={entry.name}
            type={entry.editing ? 'secondary-half' : 'secondary'}
            font="alphabet"
            alignX="center"
            position={[-3.5, 0, 0]}
          />
          <R3FWord
            text={entry.score.toString()}
            type={entry.editing ? 'secondary-half' : 'secondary'}
            font="numbers"
            alignX="center"
            position={[3.5, 0, 0]}
          />
          <R3FWord
            text={entry.level.toString()}
            type={entry.editing ? 'secondary-half' : 'secondary'}
            font="numbers"
            alignX="center"
            position={[9, 0, 0]}
          />
        </Center>
      ))}
    </group>
  );
}
