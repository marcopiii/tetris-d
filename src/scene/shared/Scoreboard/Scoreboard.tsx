import { Center } from '@react-three/drei';
import React from 'react';
import { ScoreRecord } from '~/scene/shared';
import { VOXEL_SIZE } from '../params';
import Word from '../Word';

type Props = {
  title: string;
  entries: (ScoreRecord & { editing?: boolean })[];
};

export default function Scoreboard(props: Props) {
  return (
    <group position={[0, 8, 0]}>
      <Word
        text={props.title}
        type="main"
        font="alphabet"
        alignX="center"
        position={[0, 0, 0]}
      />
      <Center position={[0, -2.5, 0]}>
        <Word
          text="#"
          type="primary-half"
          font="alphabet"
          alignX="center"
          position={[-8, 0, 0]}
        />
        <Word
          text="name"
          type="primary-half"
          font="alphabet"
          alignX="center"
          position={[-3.5, -VOXEL_SIZE.primary, 0]}
        />
        <Word
          text="score"
          type="primary-half"
          font="alphabet"
          alignX="center"
          position={[3.5, -VOXEL_SIZE.primary, 0]}
        />
        <Word
          text="lvl"
          type="primary-half"
          font="alphabet"
          alignX="center"
          position={[9, 0, 0]}
        />
      </Center>
      {props.entries.map((entry, idx) => (
        <Center key={idx} position={[0, -4.5 - idx * 1.25, 0]}>
          <Word
            text={entry.rank.toString()}
            type={entry.editing ? 'secondary-half' : 'secondary'}
            font="numbers"
            position={[-8, 0, 0]}
          />
          <Word
            text={entry.name}
            type={entry.editing ? 'secondary-half' : 'secondary'}
            font="alphabet"
            alignX="center"
            position={[-3.5, 0, 0]}
          />
          <Word
            text={entry.score.toString()}
            type={entry.editing ? 'secondary-half' : 'secondary'}
            font="numbers"
            alignX="center"
            position={[3.5, 0, 0]}
          />
          <Word
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
