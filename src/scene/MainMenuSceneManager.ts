import * as THREE from 'three';
import { MainMenu } from '../menu';
import { createWord } from './createWord';

export class MainMenuSceneManager {
  private readonly _scene: THREE.Scene;

  constructor(scene: THREE.Scene) {
    this._scene = scene;
    this._scene.background = new THREE.Color('#596067');
    this._scene.clear();
  }

  update(menu: MainMenu) {
    this._scene.clear();

    const menuGroup = new THREE.Group();
    menu.options.forEach((option, i) => {
      const word = createWord(
        option.label,
        option.selected ? 'primary' : 'secondary',
      );
      word.position.set(0, 8 * i, 0);
      menuGroup.add(word);
    });

    this._scene.add(menuGroup);
  }
}
