import * as THREE from 'three';
import TWEEN, { Group as TWEENGroup } from '@tweenjs/tween.js';
import { MINO_SIZE } from '../../params';

export type CameraPosition = 'c1' | 'c2' | 'c3' | 'c4';

export class PvPCamera {
  private readonly _camera: THREE.Camera;
  private readonly _tweenGroup: TWEENGroup;
  private _position: CameraPosition;

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

  get position(): CameraPosition {
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

type CameraSetup = {
  position: THREE.Vector3;
  lookAt: THREE.Vector3;
};

const cameraSetup: Record<CameraPosition, CameraSetup> = {
  c1: {
    position: new THREE.Vector3(-10, 5, 10 + MINO_SIZE),
    lookAt: new THREE.Vector3(0, 0, MINO_SIZE),
  },
  c2: {
    position: new THREE.Vector3(10, 5, 10 + MINO_SIZE),
    lookAt: new THREE.Vector3(0, 0, MINO_SIZE),
  },
  c3: {
    position: new THREE.Vector3(10, 4, -10 + MINO_SIZE),
    lookAt: new THREE.Vector3(0, -1, +MINO_SIZE),
  },
  c4: {
    position: new THREE.Vector3(-10, 5, -10 - MINO_SIZE),
    lookAt: new THREE.Vector3(0, 0, -MINO_SIZE),
  },
};
