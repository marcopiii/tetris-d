import { GamepadButton } from '~/controls/gamepad/types';

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
