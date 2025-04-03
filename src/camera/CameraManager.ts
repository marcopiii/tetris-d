import * as THREE from 'three';
import TWEEN, { Group as TWEENGroup } from '@tweenjs/tween.js';
import type { Position } from './types';
import { cameraSetup } from './cameraSetup';

export class CameraManager {
  private readonly _camera: THREE.Camera;
  private readonly _tweenGroup: TWEENGroup;
  private _position: Position;

  private frustumSize = 25;

  constructor(container: HTMLElement) {
    const aspect = container.clientWidth / container.clientHeight;
    this._tweenGroup = new TWEEN.Group();
    this._position = 'xR_zR';
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

  move(direction: 'right' | 'left') {
    switch (this._position) {
      case 'xR_zR':
        this._position = direction === 'right' ? 'xL_zR' : 'xR_zL';
        break;
      case 'xL_zR':
        this._position = direction === 'right' ? 'xL_zL' : 'xR_zR';
        break;
      case 'xL_zL':
        this._position = direction === 'right' ? 'xR_zL' : 'xL_zR';
        break;
      case 'xR_zL':
        this._position = direction === 'right' ? 'xR_zR' : 'xL_zL';
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
