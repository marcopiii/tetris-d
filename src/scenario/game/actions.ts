export type GameplayAction =
  | 'hold'
  | 'rotateL'
  | 'rotateR'
  | 'shiftL'
  | 'shiftR'
  | 'shiftF'
  | 'shiftB'
  | 'hardDrop';

export type CameraAction = 'moveL' | 'moveR';

export type CutAction = 'cutLeft' | 'cutRight' | 'uncutLeft' | 'uncutRight';

export type ClockAction = 'toggle' | 'startFastDrop' | 'endFastDrop';
