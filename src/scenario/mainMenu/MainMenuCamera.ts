import TWEEN, { Group as TWEENGroup } from '@tweenjs/tween.js';
import * as THREE from 'three';
import { center } from './MainMenuScene';

export class MainMenuCamera {
  private readonly _camera: THREE.Camera;
  private readonly _tweenGroup: TWEENGroup;

  constructor(camera: THREE.Camera, tweenGroup: TWEENGroup) {
    this._camera = camera;
    this._tweenGroup = tweenGroup;

    const cameraSetup = {
      position: new THREE.Vector3(-10, 5, 10),
      lookAt: center,
    };

    new TWEEN.Tween(this._camera.position, this._tweenGroup)
      .to(cameraSetup.position, 500)
      .easing(TWEEN.Easing.Exponential.Out)
      .onUpdate(() => {
        this._camera.lookAt(cameraSetup.lookAt);
      })
      .start();
  }
}
