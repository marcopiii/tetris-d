import { COLS, MINO_SIZE, ROWS } from '../params';

// translation from the Board coord system to the Scene coord system

export function translateY(y: number) {
  return -(y + 1 - ROWS / 2) * MINO_SIZE;
}

export function translateX(x: number) {
  return (x + 1 - COLS / 2) * MINO_SIZE;
}

export function translateZ(z: number) {
  return (z + 1 - COLS / 2) * MINO_SIZE;
}

export function adjustBrightness(hex: string, factor: number) {
  const rgb = parseInt(hex.slice(1), 16);
  const r = Math.min(255, Math.max(0, ((rgb >> 16) & 0xff) + factor));
  const g = Math.min(255, Math.max(0, ((rgb >> 8) & 0xff) + factor));
  const b = Math.min(255, Math.max(0, (rgb & 0xff) + factor));
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}
