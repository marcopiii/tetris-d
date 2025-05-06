import * as THREE from 'three';
import { buttonLocalization } from '../../gamepad';
import { keyboardLocalization } from '../../keyboard';
import { ControlsMenu } from './ControlsMenu';
import { VOXEL_SIZE } from '../../params';
import { createWord as _createWord } from '../../scene/createWord';
import { sizeOf } from '../../scene/utils';
import { alphabet } from '../../scene/font';

const createWord = _createWord(alphabet);

export class ControlsMenuScene {
  private readonly _scene: THREE.Scene;

  static readonly center = new THREE.Vector3(-20, 100, 20);

  constructor(scene: THREE.Scene) {
    this._scene = scene;
    this._scene.background = new THREE.Color('#596067');
    this._scene.clear();
  }

  update(menu: ControlsMenu) {
    this._scene.clear();

    const group = new THREE.Group();

    const title = createWord(
      'controls',
      'main',
      menu.currentController === 'gamepad' ? 'right' : 'left',
    );
    title.position.add({
      x: 5,
      y: 30 * VOXEL_SIZE.main,
      z: 0,
    });
    if (menu.currentController === 'gamepad')
      title.rotateY(THREE.MathUtils.degToRad(-180));
    if (menu.currentController === 'keyboard')
      title.position.multiply({ x: -1, y: 1, z: 1 });
    group.add(title);

    const binding = createWord(
      menu.currentController === 'gamepad' ? 'gamepad' : 'keyboard',
      'main',
      menu.currentController === 'gamepad' ? 'left' : 'right',
    );
    binding.position.add({
      x: 6,
      y: 30 * VOXEL_SIZE.main,
      z: 1,
    });
    binding.rotateY(THREE.MathUtils.degToRad(-90));
    if (menu.currentController === 'keyboard')
      binding.position.multiply({ x: -1, y: 1, z: 1 });
    group.add(binding);

    menu.options.forEach((option, i) => {
      const action = createWord(
        option.label,
        option.selected ? 'primary' : 'secondary',
        menu.currentController === 'gamepad' ? 'right' : 'left',
      );
      action.scale.multiplyScalar(0.6);
      const actionSize = sizeOf(action);
      action.position.add({
        x: 5,
        y: 4 + actionSize.y / 2 - 7 * VOXEL_SIZE.secondary * i,
        z: option.selected ? 3 * VOXEL_SIZE.secondary : 0,
      });
      if (menu.currentController === 'gamepad')
        action.rotateY(THREE.MathUtils.degToRad(180));
      if (menu.currentController === 'keyboard')
        action.position.multiply({ x: -1, y: 1, z: 1 });

      group.add(action);

      if (!option.accessory) return;

      const button = createWord(
        menu.currentAction === option.accessory.semanticButton
          ? '<press>'
          : menu.currentController === 'gamepad'
            ? buttonLocalization(option.accessory.gamepad)
            : keyboardLocalization(option.accessory.keyboard),
        option.selected ? 'primary' : 'secondary',
        menu.currentController === 'gamepad' ? 'left' : 'right',
      );
      button.scale.multiplyScalar(0.6);
      const buttonSize = sizeOf(button);
      button.position.add({
        x: 6 + (option.selected ? 0 : 3 * VOXEL_SIZE.secondary),
        y: 4 + buttonSize.y / 2 - 7 * VOXEL_SIZE.secondary * i,
        z: 1,
      });
      if (menu.currentController === 'keyboard')
        button.position.multiply({ x: -1, y: 1, z: 1 });

      button.rotateY(THREE.MathUtils.degToRad(-90));
      group.add(button);
    });

    group.position.add(ControlsMenuScene.center);
    group.rotateY(THREE.MathUtils.degToRad(180));

    this._scene.add(group);
  }
}
