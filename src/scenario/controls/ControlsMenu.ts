import { Button } from '../../gamepad';
import {
  ControllerKeybindings,
  KeyboardKeybindings,
} from '../../keybindings/keybinding';
import {
  readControllerKeybindings,
  readKeyboardKeybindings,
} from '../../keybindings/utils';
import { Menu } from '../../menu';

export class ControlsMenu extends Menu<Button> {
  private controllerKeybindings: ControllerKeybindings;
  private keyboardKeybindings: KeyboardKeybindings;

  constructor(onBack: () => void) {
    const controllerKeybindings = readControllerKeybindings();
    const keyboardKeybindings = readKeyboardKeybindings();

    super([
      {
        name: 'rotate right',
        accessory: controllerKeybindings.rotateR,
        action: () => {},
      },
      {
        name: 'rotate left',
        accessory: controllerKeybindings.rotateL,
        action: () => {},
      },
      {
        name: 'drop',
        accessory: controllerKeybindings.drop,
        action: () => {},
      },
      { name: 'hold', accessory: controllerKeybindings.hold, action: () => {} },
      {
        name: 'move camera left',
        accessory: controllerKeybindings.cameraL,
        action: () => {},
      },
      {
        name: 'move camera right',
        accessory: controllerKeybindings.cameraR,
        action: () => {},
      },
      {
        name: 'hide left side',
        accessory: controllerKeybindings.cutL,
        action: () => {},
      },
      {
        name: 'hide right side',
        accessory: controllerKeybindings.cutR,
        action: () => {},
      },
      {
        name: 'back',
        action: onBack,
      },
    ]);

    this.controllerKeybindings = readControllerKeybindings();
    this.keyboardKeybindings = readKeyboardKeybindings();
  }
}
