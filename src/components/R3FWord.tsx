import React from 'react';
import { match } from 'ts-pattern';
import { VOXEL_SIZE } from '../params';
import { Char, alphabet, numbers } from '../scene/font';
import R3FChar from './R3FChar';
import * as THREE from 'three';

type Props = {
  position: [number, number, number];
  text: string;
  type: 'main' | 'primary' | 'secondary';
  font: 'alphabet' | 'numbers';
  disabled?: boolean;
  sizeRef?: React.RefObject<THREE.Vector3>;
};

export default function R3FWord(props: Props) {
  const font = match(props.font)
    .with('alphabet', () => alphabet)
    .with('numbers', () => numbers)
    .exhaustive();

  const chars: Array<Char> = props.text.split('').map((char) => font[char]);

  const charWidths = chars.map((shape) => shape[0].length);
  const charOffsets = chars.map((_, i) =>
    i === 0
      ? 0
      : charWidths.slice(0, i).reduce((acc, width) => acc + width + 1, 0),
  );

  return (
    <group position={props.position}>
      {chars.map((char, i) => {
        const offset = charOffsets[i] * VOXEL_SIZE[props.type];
        return (
          <R3FChar
            position={[offset, 0, 0]}
            char={char}
            type={props.type}
            disabled={props.disabled}
            key={i}
          />
        );
      })}
    </group>
  );
}
