export type LineCoord = { y: number } & (
  | { x: number; z?: never }
  | { x?: never; z: number }
);
