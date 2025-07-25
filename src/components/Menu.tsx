import React from 'react';
import { VOXEL_SIZE } from '../params';
import R3FWord from './R3FWord';

type MenuProps = {
  title: string;
  options: MenuItem[];
};

type MenuItem<T = never> = {
  name: string;
  accessory?: T;
  action: () => void;
  terminal?: boolean;
};

export default function Menu(props: MenuProps) {
  const lineHeightMain = VOXEL_SIZE.main * 12;
  const lineHeightPrimary = VOXEL_SIZE.primary * 12;

  return (
    <group>
      <R3FWord
        text={props.title}
        type="main"
        font="alphabet"
        position={[0, 0, 0]}
      />
      {props.options.map((option, i) => (
        <R3FWord
          key={`${i}.${option.name}`}
          text={option.name}
          type="primary"
          font="alphabet"
          position={[0, -(lineHeightMain + lineHeightPrimary * i), 0]}
        />
      ))}
    </group>
  );
}
