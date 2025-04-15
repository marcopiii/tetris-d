import * as THREE from 'three';
import TWEEN, { Group as TWEENGroup } from '@tweenjs/tween.js';
import { GameScene } from './GameScene';

export type GameCameraPosition = 'c1' | 'c2' | 'c3' | 'c4';

export class GameCamera {
  private readonly _camera: THREE.Camera;
  private readonly _tweenGroup: TWEENGroup;
  private _position: GameCameraPosition;

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

  get position(): GameCameraPosition {
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

const distance = new THREE.Vector3(10, 4, 10);
const cameraSetup: Record<GameCameraPosition, CameraSetup> = {
  c1: {
    position: distance
      .clone()
      .multiply({ x: -1, y: 1, z: 1 })
      .add(GameScene.offset),
    lookAt: GameScene.center.clone().add(GameScene.offset),
  },
  c2: {
    position: distance.clone().add(GameScene.offset),
    lookAt: GameScene.center.clone().add(GameScene.offset),
  },
  c3: {
    position: distance
      .clone()
      .multiply({ x: 1, y: 1, z: -1 })
      .add(GameScene.offset),
    lookAt: GameScene.center.clone().add(GameScene.offset),
  },
  c4: {
    position: distance
      .clone()
      .multiply({ x: -1, y: 1, z: -1 })
      .add(GameScene.offset),
    lookAt: GameScene.center.clone().add(GameScene.offset),
  },
};
