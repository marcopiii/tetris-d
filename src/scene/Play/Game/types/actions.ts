export type Actions =
  | 'shiftL'
  | 'shiftR'
  | 'shiftF'
  | 'shiftB'
  | 'rotateL'
  | 'rotateR'
  | 'startDrop'
  | 'stopDrop'
  | 'hDrop';

export type CameraAction = 'cameraL' | 'cameraR';

export type CutAction = 'cutL' | 'cutR';

export type BagAction = 'hold';
