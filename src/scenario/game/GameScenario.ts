import { Button as GamepadButton, Event as GamepadEvent } from '../../gamepad';
import { KeyboardEvent as KeyboardEventType } from '../../keyboard';

export type CameraAction =
  | {
      type: 'move';
      direction: 'left' | 'right';
    }
  | {
      type: 'cut';
      side: 'above' | 'below';
    }
  | {
      type: 'uncut';
      side: 'above' | 'below';
    };

export type GameAction =
  | 'hold'
  | 'rotateL'
  | 'rotateR'
  | 'shiftL'
  | 'shiftR'
  | 'shiftF'
  | 'shiftB'
  | 'hardDrop';

export abstract class GameScenario {
  protected abstract clockCommandHandler: (action: 'toggle') => void;
  protected abstract gameCommandHandler: (command: GameAction) => void;
  protected abstract cameraCommandHandler: (
    action: Extract<CameraAction, { type: 'move' }>,
  ) => void;
  protected abstract cuttingCommandHandler: (
    action: Extract<CameraAction, { type: 'cut' | 'uncut' }>,
  ) => void;

  protected keyboardHandler = (
    event: KeyboardEventType,
    btn: KeyboardEvent['code'],
  ) => {
    if (event === 'press') {
      if (btn === 'Enter') this.clockCommandHandler('toggle');
      if (btn === 'KeyA') this.gameCommandHandler('shiftL');
      if (btn === 'KeyD') this.gameCommandHandler('shiftR');
      if (btn === 'KeyS') this.gameCommandHandler('shiftF');
      if (btn === 'KeyW') this.gameCommandHandler('shiftB');
      if (btn === 'KeyQ') this.gameCommandHandler('rotateL');
      if (btn === 'KeyE') this.gameCommandHandler('rotateR');
      if (btn === 'Space') this.gameCommandHandler('hardDrop');
      if (btn === 'Tab') this.gameCommandHandler('hold');
      if (btn === 'ArrowLeft')
        this.cameraCommandHandler({ type: 'move', direction: 'left' });
      if (btn === 'ArrowRight')
        this.cameraCommandHandler({ type: 'move', direction: 'right' });
      if (btn === 'ArrowDown')
        this.cuttingCommandHandler({ type: 'cut', side: 'below' });
      if (btn === 'ArrowUp')
        this.cuttingCommandHandler({ type: 'cut', side: 'above' });
    }
    if (event === 'release') {
      if (btn === 'ArrowDown')
        this.cuttingCommandHandler({ type: 'uncut', side: 'below' });
      if (btn === 'ArrowUp')
        this.cuttingCommandHandler({ type: 'uncut', side: 'above' });
    }
  };

  protected controllerHandler = (event: GamepadEvent, btn: GamepadButton) => {
    if (event === 'press') {
      if (btn === 'start') this.clockCommandHandler('toggle');
      if (btn === 'padL') this.gameCommandHandler('shiftL');
      if (btn === 'padR') this.gameCommandHandler('shiftR');
      if (btn === 'padD') this.gameCommandHandler('shiftF');
      if (btn === 'padU') this.gameCommandHandler('shiftB');
      if (btn === 'X') this.gameCommandHandler('rotateL');
      if (btn === 'B') this.gameCommandHandler('rotateR');
      if (btn === 'A') this.gameCommandHandler('hardDrop');
      if (btn === 'Y') this.gameCommandHandler('hold');
      if (btn === 'LT')
        this.cameraCommandHandler({ type: 'move', direction: 'left' });
      if (btn === 'RT')
        this.cameraCommandHandler({ type: 'move', direction: 'right' });
      if (btn === 'LB')
        this.cuttingCommandHandler({ type: 'cut', side: 'below' });
      if (btn === 'RB')
        this.cuttingCommandHandler({ type: 'cut', side: 'above' });
    }
    if (event === 'release') {
      if (btn === 'LB')
        this.cuttingCommandHandler({ type: 'uncut', side: 'below' });
      if (btn === 'RB')
        this.cuttingCommandHandler({ type: 'uncut', side: 'above' });
    }
  };
}
