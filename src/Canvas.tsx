import React from 'react';
import { Canvas as R3FCanvas } from '@react-three/fiber';
import { Bloom, EffectComposer } from '@react-three/postprocessing';
import { Background } from '~/Background';

type Props = {
  aspectRatio: number;
  children?: React.ReactNode;
};

export function Canvas(props: Props) {
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
    <R3FCanvas
      orthographic
      camera={{ ...frustumProps }}
      dpr={window.devicePixelRatio}
    >
      <EffectComposer>
        <Bloom
          luminanceThreshold={1}
          luminanceSmoothing={0.5}
          intensity={1.0}
        />
      </EffectComposer>
      <Background />
      {props.children}
    </R3FCanvas>
  );
}
