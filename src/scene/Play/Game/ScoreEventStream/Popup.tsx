import { useFrame } from '@react-three/fiber';
import React from 'react';
import { Word } from '~/scene/shared';

type Props = {
  position: NonNullable<React.ComponentProps<typeof Word>['position']>;
  rotation: NonNullable<React.ComponentProps<typeof Word>['rotation']>;
  alignment: NonNullable<React.ComponentProps<typeof Word>['alignX']>;
  text: string;
};

export default function Popup(props: Props) {
  const [yOffset, setYOffset] = React.useState(0);

  useFrame((_, delta) => {
    setYOffset((prev) => prev + 1.5 * delta);
  });

  return (
    <Word
      position={[
        props.position[0],
        props.position[1] + yOffset,
        props.position[2],
      ]}
      rotation={props.rotation}
      alignX={props.alignment}
      text={props.text}
      type="secondary-half"
      font="numbers"
    />
  );
}
