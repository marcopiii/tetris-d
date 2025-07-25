import React from 'react';
import { match } from 'ts-pattern';
import { VOXEL_SIZE } from '../params';
import { clamp as _clamp } from '../utils';
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

const reducer =
  (itemsLength: number) => (selectedIndex: number, action: 'up' | 'down') => {
    const clamp = _clamp(0, itemsLength - 1);
    return match(action)
      .with('up', () => clamp(selectedIndex - 1))
      .with('down', () => clamp(selectedIndex + 1))
      .exhaustive();
  };

export default function Menu(props: MenuProps) {
  const lhMain = VOXEL_SIZE.main * 12;
  const lhPrimary = VOXEL_SIZE.primary * 12;

  const [selectedIndex, navigate] = React.useReducer(
    reducer(props.options.length),
    0,
  );

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
          type={selectedIndex === i ? 'primary' : 'secondary'}
          font="alphabet"
          position={[
            0,
            -(lhMain + lhPrimary * i),
            i === selectedIndex ? VOXEL_SIZE.primary * 3 : 0,
          ]}
        />
      ))}
    </group>
  );
}
