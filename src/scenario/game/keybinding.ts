import { Button as GamepadButton } from '../../gamepad';

export type Keybindings = Record<SemanticButtons, GamepadButton>;

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

export const defaultKeybindings: Keybindings = {
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
