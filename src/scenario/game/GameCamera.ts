import * as THREE from 'three';
import TWEEN, { Group as TWEENGroup } from '@tweenjs/tween.js';
import { play } from '../../utils';
import { GameScene } from './GameScene';

const camera_move = require('../../audio/camera_move.mp3');

export type GameCameraPosition = 'c1' | 'c2' | 'c3' | 'c4';

export class GameCamera {
  private readonly _camera: THREE.Camera;
  private readonly _tweenGroup: TWEENGroup;

  private _position: GameCameraPosition;
  _cutter: { below: boolean; above: boolean };

  constructor(camera: THREE.Camera, tweenGroup: TWEENGroup) {
    this._camera = camera;
    this._tweenGroup = tweenGroup;

    this._position = 'c1';
    this._cutter = { below: false, above: false };

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
    play(camera_move, 0.05);
    new TWEEN.Tween(this._camera.position, this._tweenGroup)
      .to(target.position, 500)
      .easing(TWEEN.Easing.Exponential.Out)
      .onUpdate(() => {
        this._camera.lookAt(target.lookAt);
      })
      .start();
  }

  get cutter() {
    return this._cutter;
  }

  cut(
    cutter: {
      below: boolean | undefined;
      above: boolean | undefined;
    },
    plane: 'x' | 'z',
  ) {
    const isInverted =
      (plane === 'x' && relativeDirection[this._position].x === 'negative') ||
      (plane === 'z' && relativeDirection[this._position].z === 'negative');

    this._cutter = {
      below: (isInverted ? cutter.above : cutter.below) ?? this._cutter.below,
      above: (isInverted ? cutter.below : cutter.above) ?? this._cutter.above,
    };
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

type RelativeDirection = {
  x: 'positive' | 'negative';
  z: 'positive' | 'negative';
};

const relativeDirection: Record<GameCameraPosition, RelativeDirection> = {
  c1: {
    x: 'positive',
    z: 'positive',
  },
  c2: {
    x: 'positive',
    z: 'negative',
  },
  c3: {
    x: 'negative',
    z: 'negative',
  },
  c4: {
    x: 'negative',
    z: 'positive',
  },
};
