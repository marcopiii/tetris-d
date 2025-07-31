import React from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import TWEEN from '@tweenjs/tween.js';

type CameraSetup = {
  position: [number, number, number];
  lookAt: [number, number, number];
};

type PossibleCameraSetups<K extends string> = Record<K, CameraSetup>;

export default function useCamera<K extends string>(
  pcs: PossibleCameraSetups<K>,
) {
  const [cameraPosition, trackCameraPosition] = React.useState<K>(
    Object.keys(pcs)[0] as K,
  );

  const camera = useThree((rootState) => rootState.camera);
  const tweenGroup = React.useRef(new TWEEN.Group());

  useFrame(() => tweenGroup.current.update());

  const moveThreeCamera = (selectedCameraSetup: K, noAnimation?: boolean) => {
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

  const setCameraPosition = (selectedCameraSetup: K, noAnimation?: boolean) => {
    moveThreeCamera(selectedCameraSetup, noAnimation);
    trackCameraPosition(selectedCameraSetup);
  };

  React.useEffect(() => {
    moveThreeCamera(Object.keys(pcs)[0] as K, false);
  }, []);

  return [cameraPosition, setCameraPosition] as const;
}
