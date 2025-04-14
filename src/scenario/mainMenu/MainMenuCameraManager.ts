import * as THREE from 'three';
import { MINO_SIZE } from '../../params';

export class MainMenuCameraManager {
  private readonly _camera: THREE.Camera;

  constructor(camera: THREE.Camera) {
    this._camera = camera;

    this._camera.position.set(-10, 5, 10 + MINO_SIZE);
    this._camera.lookAt(new THREE.Vector3(0, 0, MINO_SIZE));
  }
}
