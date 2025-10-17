export type Plane = 'x' | 'z';

export type PlaneCoords = { x: number } | { z: number };

export type LineCoord = { y: number } & (
  | { x: number; z?: never }
  | { x?: never; z: number }
);

export type MinoCoord = { y: number; x: number; z: number };
