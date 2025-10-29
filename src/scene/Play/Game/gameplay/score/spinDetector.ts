import { partition } from 'es-toolkit';
import { match } from 'ts-pattern';
import { COLS } from '../../params';
import { TetriminoState } from '../../gameplay';
import { TSpinKind } from './types';
import { LineCoord } from '../../types';
import { Tetrimino } from '~/tetrimino';

export function spinDetector(
  state: Omit<TetriminoState, 'shape'> | undefined,
  board: { type: Tetrimino; x: number; y: number; z: number }[],
): [TSpinKind, LineCoord] | undefined {
  if (!state) return undefined;
  if (state.type != 'T') return undefined;

  const { position: p, rotationState: r, plane } = state;

  const pivot: LineCoord = match(plane)
    .with('x', () => ({ y: p.y + 1, z: p.z + 1 }))
    .with('z', () => ({ y: p.y + 1, x: p.x + 1 }))
    .exhaustive();

  // https://tetris.wiki/T-Spin
  const topLeft = { x: p.x, y: p.y, z: p.z, isFront: ['0', 'L'].includes(r) };
  const topRight =
    plane == 'x'
      ? { x: p.x, y: p.y, z: p.z + 2, isFront: ['0', 'R'].includes(r) }
      : { x: p.x + 2, y: p.y, z: p.z, isFront: ['0', 'R'].includes(r) };
  const bottomLeft =
    plane == 'x'
      ? { x: p.x, y: p.y + 2, z: p.z, isFront: ['2', 'L'].includes(r) }
      : { x: p.x, y: p.y + 2, z: p.z, isFront: ['2', 'L'].includes(r) };
  const bottomRight =
    plane == 'x'
      ? { x: p.x, y: p.y + 2, z: p.z + 2, isFront: ['2', 'R'].includes(r) }
      : { x: p.x + 2, y: p.y + 2, z: p.z, isFront: ['2', 'R'].includes(r) };

  const isOccupied = (p: { x: number; y: number; z: number }) =>
    board.some((b) => b.x === p.x && b.y === p.y && b.z === p.z);

  const isOutOfWalls = (p: { x: number; y: number; z: number }) =>
    p.x < 0 || p.x >= COLS || p.z < 0 || p.z >= COLS;

  const check = (p: { x: number; y: number; z: number }) =>
    isOutOfWalls(p) || isOccupied(p);

  const corners = [topLeft, topRight, bottomLeft, bottomRight].map(
    (corner) => [check(corner), corner.isFront] as const,
  );

  const [frontCorners, backCorners] = partition(
    corners,
    ([_, isFront]) => isFront,
  );

  const fc = frontCorners.reduce(
    (acc, [isOccupied]) => acc + (isOccupied ? 1 : 0),
    0,
  );
  const bc = backCorners.reduce(
    (acc, [isOccupied]) => acc + (isOccupied ? 1 : 0),
    0,
  );

  const kind = match([fc, bc])
    .with([1, 2], () => 'mini' as const)
    .with([2, 1], () => 'full' as const)
    .with([2, 2], () => 'full' as const)
    .otherwise(() => undefined);

  return kind ? [kind, pivot] : undefined;
}
