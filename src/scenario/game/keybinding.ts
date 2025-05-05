import { Button as GamepadButton } from '../../gamepad';

export type ControllerKeybindings = Record<SemanticButtons, GamepadButton>;
export type KeyboardKeybindings = Record<SemanticButtons, KeyboardEvent['code']>;

type SemanticButtons =
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
  | 'hardDrop'
  | 'fastDrop';

export const defaultControllerKeybindings: ControllerKeybindings = {
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
  hardDrop: 'A',
  fastDrop: 'A',
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
  hardDrop: 'Space',
  fastDrop: 'Space',
}
