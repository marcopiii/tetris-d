import * as THREE from 'three';
import { MainMenu } from './MainMenu';
import { VOXEL_SIZE } from '../../params';
import { createWord } from '../../scene/createWord';
import { sizeOf } from '../../scene/utils';

export const center = new THREE.Vector3(-20, 0, 20);

export class MainMenuScene {
  private readonly _scene: THREE.Scene;

  constructor(scene: THREE.Scene) {
    this._scene = scene;
    this._scene.background = new THREE.Color('#596067');
    this._scene.clear();
  }

  update(menu: MainMenu) {
    this._scene.clear();

    const group = new THREE.Group();

    const title = createWord('tetris-d', 'main');
    title.position
      .add(center)
      .add({ x: -sizeOf(title).x / 2, y: 15 * VOXEL_SIZE.main, z: 0 });
    group.add(title);

    menu.options.forEach((option, i) => {
      const word = createWord(
        option.label,
        option.selected ? 'primary' : 'secondary',
      );
      word.position.add(center).add({
        x: -sizeOf(word).x / 2,
        y: -(12 * VOXEL_SIZE.secondary * i),
        z: option.selected ? 3 * VOXEL_SIZE.secondary : 0,
      });
      group.add(word);
    });

    this._scene.add(group);
  }
}
