import { Button as GamepadButton, Event as GamepadEvent } from '../../gamepad';
import {
  GamepadKeybindings,
  KeyboardKeybindings,
} from '../../keybindings/keybinding';
import {
  readGamepadKeybindings,
  readKeyboardKeybindings,
} from '../../keybindings/utils';
import { KeyboardEvent as KeyboardEventType } from '../../keyboard';
import {
  CameraAction,
  ClockAction,
  CutAction,
  GameplayAction,
} from './actions';

export abstract class GameScenario {
  private controllerKeybindings: GamepadKeybindings;
  private keyboardKeybindings: KeyboardKeybindings;

  protected abstract onClockCmd: (command: ClockAction) => void;
  protected abstract onGameplayCmd: (command: GameplayAction) => void;
  protected abstract onCameraCmd: (command: CameraAction) => void;
  protected abstract onCutCmd: (command: CutAction) => void;

  protected constructor() {
    this.controllerKeybindings = readGamepadKeybindings();
    this.keyboardKeybindings = readKeyboardKeybindings();
  }

  protected keyboardHandler = (
    event: KeyboardEventType,
    btn: KeyboardEvent['code'],
  ) => {
    if (btn === this.keyboardKeybindings.pause && event === 'press')
      this.onClockCmd('toggle');
    if (btn === this.keyboardKeybindings.shiftL && event === 'press')
      this.onGameplayCmd('shiftL');
    if (btn === this.keyboardKeybindings.shiftR && event === 'press')
      this.onGameplayCmd('shiftR');
    if (btn === this.keyboardKeybindings.shiftF && event === 'press')
      this.onGameplayCmd('shiftF');
    if (btn === this.keyboardKeybindings.shiftB && event === 'press')
      this.onGameplayCmd('shiftB');
    if (btn === this.keyboardKeybindings.rotateL && event === 'press')
      this.onGameplayCmd('rotateL');
    if (btn === this.keyboardKeybindings.rotateR && event === 'press')
      this.onGameplayCmd('rotateR');
    if (btn === this.keyboardKeybindings.hold && event === 'press')
      this.onGameplayCmd('hold');
    if (btn === this.keyboardKeybindings.drop && event === 'release')
      this.onGameplayCmd('hardDrop');
    // todo(marco): fix fast drop
    // if (btn === this.keyboardKeybindings.fastDrop) {
    //   if (event === 'hold') this.onClockCmd('startFastDrop');
    //   if (event === 'release') this.onClockCmd('endFastDrop');
    // }
    if (btn === this.keyboardKeybindings.cameraL && event === 'press')
      this.onCameraCmd('moveL');
    if (btn === this.keyboardKeybindings.cameraR && event === 'press')
      this.onCameraCmd('moveR');
    if (btn === this.keyboardKeybindings.cutL) {
      if (event === 'press') this.onCutCmd('cutLeft');
      if (event === 'release') this.onCutCmd('uncutLeft');
    }
    if (btn === this.keyboardKeybindings.cutR) {
      if (event === 'press') this.onCutCmd('cutRight');
      if (event === 'release') this.onCutCmd('uncutRight');
    }
  };

  protected controllerHandler = (event: GamepadEvent, btn: GamepadButton) => {
    if (btn === this.controllerKeybindings.pause && event === 'press')
      this.onClockCmd('toggle');
    if (btn === this.controllerKeybindings.shiftL && event === 'press')
      this.onGameplayCmd('shiftL');
    if (btn === this.controllerKeybindings.shiftR && event === 'press')
      this.onGameplayCmd('shiftR');
    if (btn === this.controllerKeybindings.shiftF && event === 'press')
      this.onGameplayCmd('shiftF');
    if (btn === this.controllerKeybindings.shiftB && event === 'press')
      this.onGameplayCmd('shiftB');
    if (btn === this.controllerKeybindings.rotateL && event === 'press')
      this.onGameplayCmd('rotateL');
    if (btn === this.controllerKeybindings.rotateR && event === 'press')
      this.onGameplayCmd('rotateR');
    if (btn === this.controllerKeybindings.hold && event === 'press')
      this.onGameplayCmd('hold');
    if (btn === this.controllerKeybindings.drop && event === 'lift')
      this.onGameplayCmd('hardDrop');
    if (btn === this.controllerKeybindings.drop) {
      if (event === 'hold') this.onClockCmd('startFastDrop');
      if (event === 'release') this.onClockCmd('endFastDrop');
    }
    if (btn === this.controllerKeybindings.cameraL && event === 'press')
      this.onCameraCmd('moveL');
    if (btn === this.controllerKeybindings.cameraR && event === 'press')
      this.onCameraCmd('moveR');
    if (btn === this.controllerKeybindings.cutL) {
      if (event === 'press') this.onCutCmd('cutLeft');
      if (event === 'release') this.onCutCmd('uncutLeft');
    }
    if (btn === this.controllerKeybindings.cutR) {
      if (event === 'press') this.onCutCmd('cutRight');
      if (event === 'release') this.onCutCmd('uncutRight');
    }
  };
}
