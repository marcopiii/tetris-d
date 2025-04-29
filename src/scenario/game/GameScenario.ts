import { Button as GamepadButton, Event as GamepadEvent } from '../../gamepad';
import { KeyboardEvent as KeyboardEventType } from '../../keyboard';
import { CameraCommand, ClockCommand, CutCommand, GameplayCommand } from './commands';

export abstract class GameScenario {
  protected abstract onClockCmd: (command: ClockCommand) => void;
  protected abstract onGameplayCmd: (command: GameplayCommand) => void;
  protected abstract onCameraCmd: (command: CameraCommand) => void;
  protected abstract onCutCmd: (command: CutCommand) => void;

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

  protected controllerHandler = (event: GamepadEvent, btn: GamepadButton) => {
    if (event === 'press') {
      if (btn === 'start') this.onClockCmd('toggle');
      if (btn === 'padL') this.onGameplayCmd('shiftL');
      if (btn === 'padR') this.onGameplayCmd('shiftR');
      if (btn === 'padD') this.onGameplayCmd('shiftF');
      if (btn === 'padU') this.onGameplayCmd('shiftB');
      if (btn === 'X') this.onGameplayCmd('rotateL');
      if (btn === 'B') this.onGameplayCmd('rotateR');
      if (btn === 'Y') this.onGameplayCmd('hold');
      if (btn === 'LT') this.onCameraCmd('moveL');
      if (btn === 'RT') this.onCameraCmd('moveR');
      if (btn === 'LB') this.onCutCmd('cutLeft');
      if (btn === 'RB') this.onCutCmd('cutRight');
    }
    if (event === 'lift') {
      if (btn === 'A') this.onGameplayCmd('hardDrop');
    }
    if (['release', 'lift'].includes(event)) {
      if (btn === 'LB') this.onCutCmd('uncutLeft');
      if (btn === 'RB') this.onCutCmd('uncutRight');
    }
    if (event === 'hold') {
      if (btn === 'A') this.onClockCmd('startFastDrop');
    }
    if (event === 'release') {
      if (btn === 'A') this.onClockCmd('endFastDrop');
    }
  };
}
