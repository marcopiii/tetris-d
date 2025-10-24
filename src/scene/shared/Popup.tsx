import { useFrame } from '@react-three/fiber';
import TWEEN from '@tweenjs/tween.js';
import * as THREE from 'three';
import React from 'react';
import { EVENT_LIFESPAN_MS } from '~/scene/Play/Game/gameplay';
import Word from './Word';

type Props = Omit<
  React.ComponentProps<typeof Word>,
  'type' | 'font' | 'disabled' | 'alignY' | 'alignZ'
> & { toward: 'up' | 'fw' | 'rx' | 'sx'; distance: number };

export default function Popup(props: Props) {
  const [offset, setOffset] = React.useState(0);

  const t0 = React.useRef(performance.now());

  useFrame(() => {
    const dt = performance.now() - t0.current;
    const progress = TWEEN.Easing.Circular.Out(dt / EVENT_LIFESPAN_MS);
    const delta = progress * props.distance;
    setOffset(delta);
  });

  const positionVector = props.position
    ? new THREE.Vector3(...props.position)
    : new THREE.Vector3(0, 0, 0);
  const offsetVector = new THREE.Vector3(
    props.toward === 'rx' ? offset : props.toward === 'sx' ? -offset : 0,
    props.toward === 'up' ? offset : 0,
    props.toward === 'fw' ? offset : 0,
  ).applyEuler(new THREE.Euler(0, props.rotation ?? 0, 0));

  const position = positionVector.add(offsetVector).toArray();

  return (
    <Word
      position={position}
      rotation={props.rotation}
      alignX={props.alignX}
      text={props.text}
      type="secondary-half"
      font="numbers"
    />
  );
}
