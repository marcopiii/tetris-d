export type GameplayCommand =
  | 'hold'
  | 'rotateL'
  | 'rotateR'
  | 'shiftL'
  | 'shiftR'
  | 'shiftF'
  | 'shiftB'
  | 'hardDrop';

export type CameraCommand = 'moveL' | 'moveR';

export type CutCommand = 'cutLeft' | 'cutRight' | 'uncutLeft' | 'uncutRight';
