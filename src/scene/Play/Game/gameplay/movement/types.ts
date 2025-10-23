import { Shape, Tetrimino } from '~/tetrimino';
import { Plane } from '../../types';

type RotationState = '0' | 'R' | '2' | 'L';

export type TetriminoState = {
  type: Tetrimino;
  plane: Plane;
  position: { x: number; y: number; z: number };
  shape: Shape;
  rotationState: RotationState;
};

type WallKick = [number, number];

export type WallKickData = {
  initial: RotationState;
  final: RotationState;
  tests: WallKick[];
}[];
