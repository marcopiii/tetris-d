import * as THREE from 'three';
import { MainMenu } from './MainMenu';
import { VOXEL_SIZE } from '../../params';
import { createWord } from '../../scene/createWord';
import { sizeOf } from '../../scene/utils';

export class MainMenuScene {
  private readonly _scene: THREE.Scene;

  static readonly center = new THREE.Vector3(-20, 0, 20);

  constructor(scene: THREE.Scene) {
    this._scene = scene;
    this._scene.background = new THREE.Color('#596067');
    this._scene.clear();
  }

  update(menu: MainMenu) {
    this._scene.clear();

    const group = new THREE.Group();

    const title = createWord('tetris-d', 'main');
    title.position.add({
      x: -sizeOf(title).x / 2,
      y: 15 * VOXEL_SIZE.main,
      z: 0,
    });
    group.add(title);

    menu.options.forEach((option, i) => {
      const word = createWord(
        option.label,
        option.selected ? 'primary' : 'secondary',
      );
      const size = sizeOf(word)
      word.position.add({
        x: - (size.x / 2),
        y: (size.y / 2) - (12 * VOXEL_SIZE.secondary * i),
        z: option.selected ? 3 * VOXEL_SIZE.secondary : 0,
      });
      group.add(word);
    });

    group.position.add(MainMenuScene.center);
    group.rotateY(THREE.MathUtils.degToRad(180));

    this._scene.add(group);
  }
}
