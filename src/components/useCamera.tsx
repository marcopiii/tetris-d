import React from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import TWEEN from '@tweenjs/tween.js';
import { play } from '../utils';
import FX from '../audio';

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
    play(FX.camera_move, 0.05);
  };

  const relativeAxes = React.useMemo(() => {
    const {
      lookAt: [lookAtX, lookAtY, lookAtZ],
      position: [positionX, positionY, positionZ],
    } = pcs[cameraPosition];

    const forward = new THREE.Vector3(
      lookAtX - positionX,
      lookAtY - positionY,
      lookAtZ - positionZ,
    ).normalize();
    const up = new THREE.Vector3(0, 1, 0);
    const right = new THREE.Vector3().crossVectors(forward, up);

    const xAxis = new THREE.Vector3(1, 0, 0);
    const zAxis = new THREE.Vector3(0, 0, 1);
    const isXRight = right.dot(xAxis) > 0;
    const isZRight = right.dot(zAxis) > 0;

    return {
      x: {
        rightInverted: right.x < 0,
        forwardInverted: forward.x < 0,
        forwardRight: isXRight,
      },
      z: {
        rightInverted: right.z < 0,
        forwardInverted: forward.z < 0,
        forwardRight: isZRight,
      },
    };
  }, [pcs, cameraPosition]);

  React.useEffect(() => {
    moveThreeCamera(Object.keys(pcs)[0] as K, false);
  }, []);

  return [cameraPosition, setCameraPosition, relativeAxes] as const;
}
