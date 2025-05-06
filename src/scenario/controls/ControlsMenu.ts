import { Button } from '../../gamepad';
import { SemanticButton } from '../../keybindings/keybinding';
import {
  readGamepadKeybindings,
  readKeyboardKeybindings,
} from '../../keybindings/utils';
import { Menu } from '../../menu';

export class ControlsMenu extends Menu<{
  semanticButton: SemanticButton;
  gamepad: Button;
  keyboard: KeyboardEvent['code'];
}> {
  private readonly onBack: () => void;

  private editingController: 'gamepad' | 'keyboard';
  private editingAction?: SemanticButton;

  constructor(onBack: () => void) {
    super([]);
    this.onBack = onBack;
    this.refreshItems();
    this.editingController = 'gamepad';
  }

  refreshItems() {
    const controllerKeybindings = readGamepadKeybindings();
    const keyboardKeybindings = readKeyboardKeybindings();

    this._items = [
      {
        name: 'move piece left',
        accessory: {
          semanticButton: 'shiftL',
          gamepad: controllerKeybindings.shiftL,
          keyboard: keyboardKeybindings.shiftL,
        },
        action: () => (this.currentAction = 'shiftL'),
      },
      {
        name: 'move piece right',
        accessory: {
          semanticButton: 'shiftR',
          gamepad: controllerKeybindings.shiftR,
          keyboard: keyboardKeybindings.shiftR,
        },
        action: () => (this.currentAction = 'shiftR'),
      },
      {
        name: 'move piece forward',
        accessory: {
          semanticButton: 'shiftF',
          gamepad: controllerKeybindings.shiftF,
          keyboard: keyboardKeybindings.shiftF,
        },
        action: () => (this.currentAction = 'shiftF'),
      },
      {
        name: 'move piece backward',
        accessory: {
          semanticButton: 'shiftB',
          gamepad: controllerKeybindings.shiftB,
          keyboard: keyboardKeybindings.shiftB,
        },
        action: () => (this.currentAction = 'shiftB'),
      },
      {
        name: 'rotate right',
        accessory: {
          semanticButton: 'rotateR',
          gamepad: controllerKeybindings.rotateR,
          keyboard: keyboardKeybindings.rotateR,
        },
        action: () => (this.currentAction = 'rotateR'),
      },
      {
        name: 'rotate left',
        accessory: {
          semanticButton: 'rotateL',
          gamepad: controllerKeybindings.rotateL,
          keyboard: keyboardKeybindings.rotateL,
        },
        action: () => (this.currentAction = 'rotateL'),
      },
      {
        name: 'drop',
        accessory: {
          semanticButton: 'drop',
          gamepad: controllerKeybindings.drop,
          keyboard: keyboardKeybindings.drop,
        },
        action: () => (this.currentAction = 'drop'),
      },
      {
        name: 'hold',
        accessory: {
          semanticButton: 'hold',
          gamepad: controllerKeybindings.hold,
          keyboard: keyboardKeybindings.hold,
        },
        action: () => (this.currentAction = 'hold'),
      },
      {
        name: 'move camera left',
        accessory: {
          semanticButton: 'cameraL',
          gamepad: controllerKeybindings.cameraL,
          keyboard: keyboardKeybindings.cameraL,
        },
        action: () => (this.currentAction = 'cameraL'),
      },
      {
        name: 'move camera right',
        accessory: {
          semanticButton: 'cameraR',
          gamepad: controllerKeybindings.cameraR,
          keyboard: keyboardKeybindings.cameraR,
        },
        action: () => (this.currentAction = 'cameraR'),
      },
      {
        name: 'hide left side',
        accessory: {
          semanticButton: 'cutL',
          gamepad: controllerKeybindings.cutL,
          keyboard: keyboardKeybindings.cutL,
        },
        action: () => (this.currentAction = 'cutL'),
      },
      {
        name: 'hide right side',
        accessory: {
          semanticButton: 'cutR',
          gamepad: controllerKeybindings.cutR,
          keyboard: keyboardKeybindings.cutR,
        },
        action: () => (this.currentAction = 'cutR'),
      },
      {
        name: 'pause',
        accessory: {
          semanticButton: 'pause',
          gamepad: controllerKeybindings.pause,
          keyboard: keyboardKeybindings.pause,
        },
        action: () => {},
      },
      {
        name: 'back',
        action: this.onBack,
        terminal: true,
      },
    ];
  }

  set currentController(controller: 'gamepad' | 'keyboard') {
    this.editingController = controller;
  }

  get currentController() {
    return this.editingController;
  }

  get currentAction() {
    return this.editingAction;
  }

  set currentAction(action: SemanticButton | undefined) {
    this.editingAction = action;
  }
}
