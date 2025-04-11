import * as THREE from 'three';
import { MainMenu } from './MainMenu';
import { VOXEL_SIZE } from '../../params';
import { createWord } from '../../scene/createWord';
import { sizeOf } from '../../scene/utils';

export class MainMenuSceneManager {
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
    title.position.set(
      -sizeOf(title).x / 2,
      15 * VOXEL_SIZE.main,
      0
    );
    group.add(title);

    menu.options.forEach((option, i) => {
      const word = createWord(
        option.label,
        option.selected ? 'primary' : 'secondary',
      );
      word.position.set(
        -sizeOf(word).x / 2,
        -(12 * VOXEL_SIZE.secondary * i),
        option.selected ? 3 * VOXEL_SIZE.secondary : 0,
      );
      group.add(word);
    });

    this._scene.add(group);
  }
}
