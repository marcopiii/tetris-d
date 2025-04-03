import { COLS, MINO_SIZE, ROWS } from '../params';

// translation from the Board coord system to the Scene coord system
export const translateY = (y: number) => -(y + 1 - ROWS / 2) * MINO_SIZE;
export const translateX = (x: number) => (x + 1 - COLS / 2) * MINO_SIZE;
export const translateZ = (z: number) => (z + 1 - COLS / 2) * MINO_SIZE;
