import React from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import TWEEN from '@tweenjs/tween.js';

type CameraSetup = {
  position: [number, number, number];
  lookAt: [number, number, number];
};

type PossibleCameraSetups<K extends string> = Record<K, CameraSetup>;

export default function useSetCamera<K extends string>(
  pcs: PossibleCameraSetups<K>,
) {
  const camera = useThree((rootState) => rootState.camera);
  const tweenGroup = React.useRef(new TWEEN.Group());

  useFrame(() => tweenGroup.current.update());

  return (selectedCameraSetup: K, noAnimation?: boolean) => {
    const cameraSetup = pcs[selectedCameraSetup];

    if (noAnimation) {
      camera.position.set(...cameraSetup.position);
      camera.lookAt(...cameraSetup.lookAt);
      return;
    }

    new TWEEN.Tween(camera.position, tweenGroup.current)
      .to(new THREE.Vector3(...cameraSetup.position), 500)
      .easing(TWEEN.Easing.Exponential.Out)
      .onUpdate(() => camera.lookAt(...cameraSetup.lookAt))
      .start();
  };
}
