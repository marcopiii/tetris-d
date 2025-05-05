import { Button as GamepadButton, Event as GamepadEvent } from '../../gamepad';
import { KeyboardEvent as KeyboardEventType } from '../../keyboard';
import {
  CameraCommand,
  ClockCommand,
  CutCommand,
  GameplayCommand,
} from './commands';
import { defaultKeybindings, Keybindings } from './keybinding';

export abstract class GameScenario {
  private keybindings: Keybindings;

  protected abstract onClockCmd: (command: ClockCommand) => void;
  protected abstract onGameplayCmd: (command: GameplayCommand) => void;
  protected abstract onCameraCmd: (command: CameraCommand) => void;
  protected abstract onCutCmd: (command: CutCommand) => void;

  protected constructor() {
    this.keybindings = this.readControllerKeybindings();
  }

  private readControllerKeybindings(): Keybindings {
    const storedKeybindings = window.localStorage.getItem('controller-keybindings');
    if (!storedKeybindings) return defaultKeybindings;
    try {
      return JSON.parse(storedKeybindings);
    } catch (error) {
      console.error('Error parsing controller config:', error);
      return defaultKeybindings;
    }
  }

  protected keyboardHandler = (
    event: KeyboardEventType,
    btn: KeyboardEvent['code'],
  ) => {
    if (event === 'press') {
      if (btn === 'Enter') this.onClockCmd('toggle');
      if (btn === 'KeyA') this.onGameplayCmd('shiftL');
      if (btn === 'KeyD') this.onGameplayCmd('shiftR');
      if (btn === 'KeyS') this.onGameplayCmd('shiftF');
      if (btn === 'KeyW') this.onGameplayCmd('shiftB');
      if (btn === 'KeyQ') this.onGameplayCmd('rotateL');
      if (btn === 'KeyE') this.onGameplayCmd('rotateR');
      if (btn === 'Space') this.onGameplayCmd('hardDrop');
      if (btn === 'Tab') this.onGameplayCmd('hold');
      if (btn === 'ArrowLeft') this.onCameraCmd('moveL');
      if (btn === 'ArrowRight') this.onCameraCmd('moveR');
      if (btn === 'ArrowDown') this.onCutCmd('cutLeft');
      if (btn === 'ArrowUp') this.onCutCmd('cutRight');
    }
    if (event === 'release') {
      if (btn === 'ArrowDown') this.onCutCmd('uncutLeft');
      if (btn === 'ArrowUp') this.onCutCmd('uncutRight');
    }
  };

  protected async controllerHandler(event: GamepadEvent, btn: GamepadButton) {
    if (btn === this.keybindings.pause && event === 'press')
      this.onClockCmd('toggle');
    if (btn === this.keybindings.shiftL && event === 'press')
      this.onGameplayCmd('shiftL');
    if (btn === this.keybindings.shiftR && event === 'press')
      this.onGameplayCmd('shiftR');
    if (btn === this.keybindings.shiftF && event === 'press')
      this.onGameplayCmd('shiftF');
    if (btn === this.keybindings.shiftB && event === 'press')
      this.onGameplayCmd('shiftB');
    if (btn === this.keybindings.rotateL && event === 'press')
      this.onGameplayCmd('rotateL');
    if (btn === this.keybindings.rotateR && event === 'press')
      this.onGameplayCmd('rotateR');
    if (btn === this.keybindings.hold && event === 'press')
      this.onGameplayCmd('hold');
    if (btn === this.keybindings.hardDrop && event === 'lift')
      this.onGameplayCmd('hardDrop');
    if (btn === this.keybindings.fastDrop) {
      if (event === 'hold') this.onClockCmd('startFastDrop');
      if (event === 'release') this.onClockCmd('endFastDrop');
    }
    if (btn === this.keybindings.cameraL && event === 'press')
      this.onCameraCmd('moveL');
    if (btn === this.keybindings.cameraR && event === 'press')
      this.onCameraCmd('moveR');
    if (btn === this.keybindings.cutL) {
      if (event === 'press') this.onCutCmd('cutLeft');
      if (event === 'release') this.onCutCmd('uncutLeft');
    }
    if (btn === this.keybindings.cutR) {
      if (event === 'press') this.onCutCmd('cutRight');
      if (event === 'release') this.onCutCmd('uncutRight');
    }
  }
}
