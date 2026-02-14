import { match } from 'ts-pattern';
import { calculateMatrix } from '~/scene/Play/Game/gameplay/calculateMatrix';
import { detectCollision } from '~/scene/Play/Game/gameplay/detectCollision';
import { GameParams } from '~/scene/Play/Game/params';
import { MinoCoord } from '~/scene/Play/Game/types';
import { ZicData } from './TrackEvent';
import { shiftLeft, shiftRight, TetriminoState, undrop } from '../../gameplay';

export function zicDetector(
  state: TetriminoState | undefined,
  board: MinoCoord[],
  gameParams: GameParams,
): ZicData | undefined {
  if (!state) return undefined;

  const fixedPieceMinos = calculateMatrix(
    state.shape,
    state.position,
    state.plane,
  );

  const rails = match(state.plane)
    .with('x', () => fixedPieceMinos.map(({ y, z }) => ({ y, z })))
    .with('z', () => fixedPieceMinos.map(({ y, x }) => ({ y, x })))
    .exhaustive();

  const checkMino = checkMinoOn(board, gameParams);

  const isPerfectFit = fixedPieceMinos.every((fp) => {
    const over = { x: fp.x, y: fp.y - 1, z: fp.z };
    const under = { x: fp.x, y: fp.y + 1, z: fp.z };
    const left = match(state.plane)
      .with('x', () => ({ x: fp.x, y: fp.y, z: fp.z - 1 }))
      .with('z', () => ({ x: fp.x - 1, y: fp.y, z: fp.z }))
      .exhaustive();
    const right = match(state.plane)
      .with('x', () => ({ x: fp.x, y: fp.y, z: fp.z + 1 }))
      .with('z', () => ({ x: fp.x + 1, y: fp.y, z: fp.z }))
      .exhaustive();
    return [over, under, left, right].map(checkMino).every(Boolean);
  });
  if (isPerfectFit)
    return {
      kind: 'full',
      rails: rails,
    };

  // the provided board already includes the fixed piece
  // so we need to remove the fixed piece from the board
  // or any test will fail
  const prevBoard = board.filter(
    (b) =>
      !fixedPieceMinos.some(
        (fp) => fp.x === b.x && fp.y === b.y && fp.z === b.z,
      ),
  );

  const testMove = testMoveOn(state, prevBoard, gameParams);
  const canMoveOnPlane = [undrop, shiftLeft, shiftRight]
    .map(testMove)
    .some(Boolean);
  return canMoveOnPlane ? undefined : { kind: 'mini', rails: rails };
}

/** Check if a position is occupied by a mino or out of bound */
const checkMinoOn =
  (board: MinoCoord[], { cols, rows, vanishZoneRows }: GameParams) =>
  (mino: MinoCoord) => {
    return (
      mino.y >= rows + vanishZoneRows ||
      mino.x < 0 ||
      mino.x >= cols ||
      mino.z < 0 ||
      mino.z >= cols ||
      board.some((b) => b.x === mino.x && b.y === mino.y && b.z === mino.z)
    );
  };

const testMoveOn =
  (state: TetriminoState, board: MinoCoord[], gameParams: GameParams) =>
  (move: (state: TetriminoState) => TetriminoState) => {
    const { shape, position, plane } = move(state);
    const testingPosition = calculateMatrix(shape, position, plane);
    return !detectCollision(testingPosition, board, gameParams);
  };
