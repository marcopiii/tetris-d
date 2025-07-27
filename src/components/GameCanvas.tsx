import { Canvas } from '@react-three/fiber';
import React from 'react';

type Props = {
  aspectRatio: number;
  children?: React.ReactNode;
};

export function GameCanvas(props: Props) {
  const frustumHeight = 22;
  const frustumProps = {
    left: (-frustumHeight * props.aspectRatio) / 2,
    right: (frustumHeight * props.aspectRatio) / 2,
    top: frustumHeight / 2,
    bottom: -frustumHeight / 2,
    near: 0.1,
    far: 1000,
    frustumCulled: true,
  };

  return (
    <Canvas
      orthographic
      camera={{ ...frustumProps }}
      dpr={window.devicePixelRatio}
    >
      {props.children}
    </Canvas>
  );
}
