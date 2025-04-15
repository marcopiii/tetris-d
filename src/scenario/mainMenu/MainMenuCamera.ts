import TWEEN, { Group as TWEENGroup } from '@tweenjs/tween.js';
import * as THREE from 'three';
import { MainMenuScene } from './MainMenuScene';

export type MainMenuCameraPosition = 'c1' | 'c2';

export class MainMenuCamera {
  private readonly _camera: THREE.Camera;
  private readonly _tweenGroup: TWEENGroup;
  private _position: MainMenuCameraPosition;

  constructor(camera: THREE.Camera, tweenGroup: TWEENGroup) {
    this._camera = camera;
    this._tweenGroup = tweenGroup;

    this._position = 'c1';
    const initPosition = cameraSetup[this._position];

    new TWEEN.Tween(this._camera.position, this._tweenGroup)
      .to(initPosition.position, 500)
      .easing(TWEEN.Easing.Exponential.Out)
      .onUpdate(() => {
        this._camera.lookAt(initPosition.lookAt);
      })
      .start();
  }

  move(direction: 'left' | 'right') {
    switch (this._position) {
      case 'c1':
        this._position = direction === 'right' ? 'c2' : 'c1';
        break;
      case 'c2':
        this._position = direction === 'right' ? 'c2' : 'c1';
        break;
    }
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
const cameraSetup: Record<MainMenuCameraPosition, CameraSetup> = {
  c1: {
    position: MainMenuScene.center.clone().add(distance),
    lookAt: MainMenuScene.center,
  },
  c2: {
    position: MainMenuScene.center
      .clone()
      .add(distance.clone().multiply({ x: -1, y: 1, z: 1 })),
    lookAt: MainMenuScene.center,
  },
};
