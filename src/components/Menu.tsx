import React from 'react';
import { VOXEL_SIZE } from '../params';
import R3FWord from './R3FWord';
import { SelectableMenuItem } from './utils.';

type MenuProps = {
  title: string;
  options: SelectableMenuItem[];
};

export default function Menu(props: MenuProps) {
  const lhMain = VOXEL_SIZE.main * 12;
  const lhPrimary = VOXEL_SIZE.primary * 12;

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
          type={option.selected ? 'primary' : 'secondary'}
          font="alphabet"
          position={[
            0,
            -(lhMain + lhPrimary * i),
            option.selected ? VOXEL_SIZE.primary * 3 : 0,
          ]}
        />
      ))}
    </group>
  );
}
