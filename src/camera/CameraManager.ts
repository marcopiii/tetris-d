import * as THREE from 'three';
import TWEEN, { Group as TWEENGroup } from '@tweenjs/tween.js';
import { CameraAction } from '../action';
import { Position } from './types';
import { cameraSetup } from './cameraSetup';

export class CameraManager {
  private readonly _camera: THREE.Camera;
  private readonly _tweenGroup: TWEENGroup;
  private _position: Position;

  private frustumSize = 22;

  constructor(container: HTMLElement) {
    const aspect = container.clientWidth / container.clientHeight;
    this._tweenGroup = new TWEEN.Group();
    this._position = 'c1';
    this._camera = new THREE.OrthographicCamera(
      (-this.frustumSize * aspect) / 2,
      (this.frustumSize * aspect) / 2,
      this.frustumSize / 2,
      -this.frustumSize / 2,
    );
    const initPosition = cameraSetup[this._position];
    this._camera.position.set(
      initPosition.position.x,
      initPosition.position.y,
      initPosition.position.z,
    );
    this._camera.lookAt(cameraSetup[this._position].lookAt);
  }

  get camera() {
    return this._camera;
  }

  get tween() {
    return this._tweenGroup;
  }

  get position(): Position {
    return this._position;
  }

  move(direction: 'left' | 'right') {
    switch (this._position) {
      case 'c1':
        this._position = direction === 'right' ? 'c2' : 'c4';
        break;
      case 'c2':
        this._position = direction === 'right' ? 'c3' : 'c1';
        break;
      case 'c3':
        this._position = direction === 'right' ? 'c4' : 'c2';
        break;
      case 'c4':
        this._position = direction === 'right' ? 'c1' : 'c3';
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
