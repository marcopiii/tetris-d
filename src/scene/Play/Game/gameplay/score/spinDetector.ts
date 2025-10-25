import { partition } from 'es-toolkit';
import { match } from 'ts-pattern';
import { TetriminoState } from '~/scene/Play/Game/gameplay';
import { LineCoord } from '~/scene/Play/Game/types';
import { Tetrimino } from '~/tetrimino';

export function spinDetector(
  state: Omit<TetriminoState, 'shape'> | undefined,
  board: { type: Tetrimino; x: number; y: number; z: number }[],
) {
  if (!state) return undefined;
  if (state.type != 'T') return undefined;

  const { position: p, rotationState: r, plane } = state;

  const pivot: LineCoord = match(plane)
    .with('x', () => ({ y: p.y + 1, z: p.z + 1 }))
    .with('z', () => ({ y: p.y + 1, x: p.x + 1 }))
    .exhaustive();

  // https://tetris.wiki/T-Spin
  const cornersCoord = {
    topLeft: { x: p.x, y: p.y, z: p.z, front: ['0', 'L'].includes(r) },
    topRight:
      plane == 'x'
        ? { x: p.x, y: p.y, z: p.z + 2, front: ['0', 'R'].includes(r) }
        : { x: p.x + 2, y: p.y, z: p.z, front: ['0', 'R'].includes(r) },
    bottomLeft:
      plane == 'x'
        ? { x: p.x, y: p.y + 2, z: p.z, front: ['2', 'L'].includes(r) }
        : { x: p.x, y: p.y + 2, z: p.z, front: ['2', 'L'].includes(r) },
    bottomRight:
      plane == 'x'
        ? { x: p.x, y: p.y + 2, z: p.z + 2, front: ['2', 'R'].includes(r) }
        : { x: p.x + 2, y: p.y + 2, z: p.z, front: ['2', 'R'].includes(r) },
  };

  // todo: check for walls
  const corners = [
    [
      board.some(
        (b) =>
          b.x === cornersCoord.topLeft.x &&
          b.y === cornersCoord.topLeft.y &&
          b.z === cornersCoord.topLeft.z,
      ),
      cornersCoord.topLeft.front,
    ] as const,
    [
      board.some(
        (b) =>
          b.x === cornersCoord.topRight.x &&
          b.y === cornersCoord.topRight.y &&
          b.z === cornersCoord.topRight.z,
      ),
      cornersCoord.topRight.front,
    ] as const,
    [
      board.some(
        (b) =>
          b.x === cornersCoord.bottomLeft.x &&
          b.y === cornersCoord.bottomLeft.y &&
          b.z === cornersCoord.bottomLeft.z,
      ),
      cornersCoord.bottomLeft.front,
    ] as const,
    [
      board.some(
        (b) =>
          b.x === cornersCoord.bottomRight.x &&
          b.y === cornersCoord.bottomRight.y &&
          b.z === cornersCoord.bottomRight.z,
      ),
      cornersCoord.bottomRight.front,
    ] as const,
  ];

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

  return kind
    ? ([kind, pivot] satisfies ['mini' | 'full', LineCoord])
    : undefined;
}
