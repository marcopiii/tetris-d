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

export class ControlsMenu extends Menu<{
  gamepad: Button;
  keyboard: KeyboardEvent['code'];
}> {
  private controllerKeybindings: ControllerKeybindings;
  private keyboardKeybindings: KeyboardKeybindings;

  private binding: 'gamepad' | 'keyboard' = 'gamepad';

  constructor(onBack: () => void) {
    const controllerKeybindings = readControllerKeybindings();
    const keyboardKeybindings = readKeyboardKeybindings();

    super([
      {
        name: 'move piece left',
        accessory: {
          gamepad: controllerKeybindings.shiftL,
          keyboard: keyboardKeybindings.shiftL,
        },
        action: () => {},
      },
      {
        name: 'move piece right',
        accessory: {
          gamepad: controllerKeybindings.shiftR,
          keyboard: keyboardKeybindings.shiftR,
        },
        action: () => {},
      },
      {
        name: 'move piece forward',
        accessory: {
          gamepad: controllerKeybindings.shiftF,
          keyboard: keyboardKeybindings.shiftF,
        },
        action: () => {},
      },
      {
        name: 'move piece backward',
        accessory: {
          gamepad: controllerKeybindings.shiftB,
          keyboard: keyboardKeybindings.shiftB,
        },
        action: () => {},
      },
      {
        name: 'rotate right',
        accessory: {
          gamepad: controllerKeybindings.rotateR,
          keyboard: keyboardKeybindings.rotateR,
        },
        action: () => {},
      },
      {
        name: 'rotate left',
        accessory: {
          gamepad: controllerKeybindings.rotateL,
          keyboard: keyboardKeybindings.rotateL,
        },
        action: () => {},
      },
      {
        name: 'drop',
        accessory: {
          gamepad: controllerKeybindings.drop,
          keyboard: keyboardKeybindings.drop,
        },
        action: () => {},
      },
      {
        name: 'hold',
        accessory: {
          gamepad: controllerKeybindings.hold,
          keyboard: keyboardKeybindings.hold,
        },
        action: () => {},
      },
      {
        name: 'move camera left',
        accessory: {
          gamepad: controllerKeybindings.cameraL,
          keyboard: keyboardKeybindings.cameraL,
        },
        action: () => {},
      },
      {
        name: 'move camera right',
        accessory: {
          gamepad: controllerKeybindings.cameraR,
          keyboard: keyboardKeybindings.cameraR,
        },
        action: () => {},
      },
      {
        name: 'hide left side',
        accessory: {
          gamepad: controllerKeybindings.cutL,
          keyboard: keyboardKeybindings.cutL,
        },
        action: () => {},
      },
      {
        name: 'hide right side',
        accessory: {
          gamepad: controllerKeybindings.cutR,
          keyboard: keyboardKeybindings.cutR,
        },
        action: () => {},
      },
      {
        name: 'reset',
        action: () => {},
      },
      {
        name: 'back',
        action: onBack,
        terminal: true,
      },
    ]);

    this.binding = 'gamepad';
    this.controllerKeybindings = readControllerKeybindings();
    this.keyboardKeybindings = readKeyboardKeybindings();
  }

  set editing(binding: 'gamepad' | 'keyboard') {
    this.binding = binding;
  }

  get editing() {
    return this.binding;
  }
}
