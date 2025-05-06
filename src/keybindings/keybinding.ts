import { Button as GamepadButton } from '../gamepad';

export type GamepadKeybindings = Record<SemanticButton, GamepadButton>;
export type KeyboardKeybindings = Record<SemanticButton, KeyboardEvent['code']>;

export type SemanticButton =
  | 'pause'
  | 'shiftL'
  | 'shiftR'
  | 'shiftF'
  | 'shiftB'
  | 'rotateL'
  | 'rotateR'
  | 'hold'
  | 'cameraL'
  | 'cameraR'
  | 'cutL'
  | 'cutR'
  | 'drop';

export const defaultGamepadKeybindings: GamepadKeybindings = {
  pause: 'start',
  shiftL: 'padL',
  shiftR: 'padR',
  shiftF: 'padD',
  shiftB: 'padU',
  rotateL: 'X',
  rotateR: 'B',
  hold: 'Y',
  cameraL: 'LT',
  cameraR: 'RT',
  cutL: 'LB',
  cutR: 'RB',
  drop: 'A',
};

export const defaultKeyboardKeybindings: KeyboardKeybindings = {
  pause: 'Enter',
  shiftL: 'KeyA',
  shiftR: 'KeyD',
  shiftF: 'KeyS',
  shiftB: 'KeyW',
  rotateL: 'KeyQ',
  rotateR: 'KeyE',
  hold: 'KeyX',
  cameraL: 'ArrowLeft',
  cameraR: 'ArrowRight',
  cutL: 'ArrowDown',
  cutR: 'ArrowUp',
  drop: 'Space',
};
