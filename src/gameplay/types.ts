import { Name as Tetrimino } from '../tetrimino';

export type Plane = 'x' | 'z';

export type Coord = { x: number; y: number; z: number };

export type BoardBlock = Tetrimino | 'DELETE';

export type Move =
  | 'hold'
  | 'shiftL'
  | 'shiftR'
  | 'shiftB'
  | 'shiftF'
  | 'rotateL'
  | 'rotateR'
  | 'hardDrop';
