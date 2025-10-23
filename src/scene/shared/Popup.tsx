import { useFrame } from '@react-three/fiber';
import React from 'react';
import Word from './Word';

type Props = Omit<
  React.ComponentProps<typeof Word>,
  'type' | 'font' | 'disabled' | 'alignY' | 'alignZ'
> & { toward?: 'up' | 'fw' };

export default function Popup(props: Props) {
  const [offset, setOffset] = React.useState(0);

  useFrame((_, delta) => {
    setOffset((prev) => prev + 0.5 * delta);
  });

  const position = [
    props.position[0],
    props.position[1] + (props.toward === 'up' ? offset : 0),
    props.position[2] + (props.toward === 'fw' ? offset : 0),
  ] satisfies [number, number, number];

  return (
    <>
      <Word
        position={position}
        rotation={props.rotation}
        alignX={props.alignX}
        text={props.text}
        type="secondary-half"
        font="numbers"
      />
    </>
  );
}
