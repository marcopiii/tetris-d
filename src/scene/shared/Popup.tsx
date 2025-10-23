import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import React from 'react';
import Word from './Word';

type Props = Omit<
  React.ComponentProps<typeof Word>,
  'type' | 'font' | 'disabled' | 'alignY' | 'alignZ'
> & { toward: 'up' | 'fw' | 'rx' | 'sx' };

export default function Popup(props: Props) {
  const [offset, setOffset] = React.useState(0);

  useFrame((_, delta) => {
    setOffset((prev) => prev + 0.1 * delta);
  });

  const positionVector = props.position
    ? new THREE.Vector3(...props.position)
    : new THREE.Vector3(0, 0, 0);
  const offsetVector = new THREE.Vector3(
    props.toward === 'rx' ? offset : props.toward === 'sx' ? -offset : 0,
    props.toward === 'up' ? offset : 0,
    props.toward === 'fw' ? offset : 0,
  ).applyEuler(new THREE.Euler(0, props.rotation ?? 0, 0));

  const position = positionVector.add(offsetVector);

  return (
    <Word
      position={[position.x, position.y, position.z]}
      rotation={props.rotation}
      alignX={props.alignX}
      text={props.text}
      type="secondary-half"
      font="numbers"
    />
  );
}
