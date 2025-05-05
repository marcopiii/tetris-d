import TWEEN, { Group as TWEENGroup } from '@tweenjs/tween.js';
import * as THREE from 'three';
import { ControlsMenuScene } from './ControlsMenuScene';

export type ControlsMenuCameraPosition = 'controller' | 'keyboard';

export class ControlsMenuCamera {
  private readonly _camera: THREE.Camera;
  private readonly _tweenGroup: TWEENGroup;
  private _position: ControlsMenuCameraPosition;

  constructor(camera: THREE.Camera, tweenGroup: TWEENGroup) {
    this._camera = camera;
    this._tweenGroup = tweenGroup;

    this._position = 'controller';
    const initPosition = cameraSetup[this._position];

    new TWEEN.Tween(this._camera.position, this._tweenGroup)
      .to(initPosition.position, 500)
      .easing(TWEEN.Easing.Exponential.Out)
      .onUpdate(() => {
        this._camera.lookAt(initPosition.lookAt);
      })
      .start();
  }

  move(position: 'controller' | 'keyboard') {
    this._position = position;
    const target = cameraSetup[this._position];
    new TWEEN.Tween(this._camera.position, this._tweenGroup)
      .to(target.position, 500)
      .easing(TWEEN.Easing.Exponential.Out)
      .onUpdate(() => {
        this._camera.lookAt(target.lookAt);
      })
      .start();
  }
}

type CameraSetup = {
  position: THREE.Vector3;
  lookAt: THREE.Vector3;
};

const distance = new THREE.Vector3(10, 4, -10);
const cameraSetup: Record<ControlsMenuCameraPosition, CameraSetup> = {
  controller: {
    position: ControlsMenuScene.center.clone().add(distance),
    lookAt: ControlsMenuScene.center,
  },
  keyboard: {
    position: ControlsMenuScene.center
      .clone()
      .add(distance.clone().multiply({ x: -1, y: 1, z: 1 })),
    lookAt: ControlsMenuScene.center,
  },
};
