import React from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import TWEEN from '@tweenjs/tween.js';
import { RelativeAxes } from '~/scene/shared/camera';
import { FX, play } from '~/audio';

const MAX_TILT_DEG = 5;

type CameraSetup = {
  position: [number, number, number];
  lookAt: [number, number, number];
};

type PossibleCameraSetups<K extends string> = Record<K, CameraSetup>;

export default function useCamera<K extends string>(
  pcs: PossibleCameraSetups<K>,
) {
  const [selectedCameraPosition, trackSelectedCameraPosition] =
    React.useState<K>(Object.keys(pcs)[0] as K);

  const camera = useThree((rootState) => rootState.camera);
  const tweenGroup = React.useRef(new TWEEN.Group());

  useFrame(() => tweenGroup.current.update());

  const moveThreeCamera = (targetCameraPosition: K, noAnimation?: boolean) => {
    const targetSetup = pcs[targetCameraPosition];

    if (noAnimation) {
      camera.position.set(...targetSetup.position);
      camera.lookAt(...targetSetup.lookAt);
      return;
    }

    new TWEEN.Tween(camera.position, tweenGroup.current)
      .to(new THREE.Vector3(...targetSetup.position), 750)
      .easing(TWEEN.Easing.Exponential.Out)
      .onUpdate(() => camera.lookAt(...targetSetup.lookAt))
      .start();
  };

  const setCameraPosition = (selectedCameraSetup: K, noAnimation?: boolean) => {
    moveThreeCamera(selectedCameraSetup, noAnimation);
    trackSelectedCameraPosition(selectedCameraSetup);
    play(FX.camera_move, 0.05);
  };

  const lookAtPoint = new THREE.Vector3(...pcs[selectedCameraPosition].lookAt);
  const currentPosition = new THREE.Vector3(
    ...pcs[selectedCameraPosition].position,
  );

  const forward = lookAtPoint.clone().sub(currentPosition);
  const up = new THREE.Vector3(0, 1, 0);
  const right = new THREE.Vector3().crossVectors(forward, up);

  const xAxis = new THREE.Vector3(1, 0, 0);
  const zAxis = new THREE.Vector3(0, 0, 1);
  const isXRight = right.dot(xAxis) > 0;
  const isZRight = right.dot(zAxis) > 0;

  const relativeAxes: RelativeAxes = {
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

  /**
   * Tilts the camera from the current position.
   * @param horizontal the percentage to tilt horizontally (-1 to 1)
   * @param vertical the percentage to tilt vertically (-1 to 1)
   */
  const tiltCamera = (horizontal: number, vertical: number) => {
    // camera spherical coordinates relative to lookAt point
    const spherical = new THREE.Spherical().setFromVector3(
      forward.clone().multiplyScalar(-1),
    );

    const hRad = THREE.MathUtils.degToRad(horizontal * MAX_TILT_DEG);
    const vRad = THREE.MathUtils.degToRad(vertical * MAX_TILT_DEG);
    spherical.theta += hRad;
    spherical.phi += vRad;

    const targetCameraPosition = lookAtPoint
      .clone()
      .add(new THREE.Vector3().setFromSpherical(spherical));

    camera.position.copy(targetCameraPosition);
    camera.lookAt(lookAtPoint);
  };

  React.useEffect(() => {
    moveThreeCamera(Object.keys(pcs)[0] as K, false);
  }, []);

  return {
    camera: selectedCameraPosition,
    setCamera: setCameraPosition,
    tiltCamera,
    relativeAxes,
  } as const;
}
