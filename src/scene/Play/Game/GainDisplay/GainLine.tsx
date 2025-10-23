import { useFrame } from '@react-three/fiber';
import React from 'react';
import comboName from './comboName';
import { PlaneCombo } from '../gameplay';
import { Word } from '~/scene/shared';

type Props = {
  position: NonNullable<React.ComponentProps<typeof Word>['position']>;
  rotation: NonNullable<React.ComponentProps<typeof Word>['rotation']>;
  alignment: NonNullable<React.ComponentProps<typeof Word>['alignX']>;
  lineNumber: number;
  kind: PlaneCombo;
};

export default function GainLine(props: Props) {
  const [yOffset, setYOffset] = React.useState(0);

  useFrame((_, delta) => {
    setYOffset((prev) => prev + 1.5 * delta);
  });

  const text = [
    `+${props.lineNumber.toString()}`,
    `LINE${props.lineNumber > 1 ? 'S' : ''}`,
    ...match(props.kind)
      .with('par', () => ['PAR'])
      .with('ort', () => ['ORT'])
      .otherwise(() => []),
  ].join(' ');

  return (
    <Word
      position={[
        props.position[0],
        props.position[1] + yOffset,
        props.position[2],
      ]}
      rotation={props.rotation}
      alignX={props.alignment}
      text={text}
      type="secondary-half"
      font="numbers"
    />
  );
}
