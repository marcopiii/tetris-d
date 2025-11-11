import { calculateMatrix } from '~/scene/Play/Game/gameplay/calculateMatrix';
import { detectCollision } from '~/scene/Play/Game/gameplay/detectCollision';
import { ZicData } from './TrackEvent';
import { shiftLeft, shiftRight, TetriminoState, undrop } from '../../gameplay';
import { Tetrimino } from '~/tetrimino';

export function zicDetector(
  state: TetriminoState | undefined,
  board: { type: Tetrimino; x: number; y: number; z: number }[],
): ZicData | undefined {
  if (!state) return undefined;

  // the provided board already includes the fixed piece
  // so we need to remove the fixed piece from the board
  // or any test will fail
  const fixedPieceMinos = calculateMatrix(
    state.shape,
    state.position,
    state.plane,
  );
  const prevBoard = board.filter(
    (b) =>
      !fixedPieceMinos.some(
        (fp) => fp.x === b.x && fp.y === b.y && fp.z === b.z,
      ),
  );

  // todo: check if the piece is perfectly fitted into a gap
  const isPerfectFit = false;
  if (isPerfectFit) return { kind: 'full' };

  const testMove = testMoveOn(state, prevBoard);
  const canMoveOnPlane = [undrop, shiftLeft, shiftRight]
    .map(testMove)
    .some(Boolean);
  return canMoveOnPlane ? undefined : { kind: 'mini' };
}

const testMoveOn =
  (
    state: TetriminoState,
    board: {
      type: Tetrimino;
      x: number;
      y: number;
      z: number;
    }[],
  ) =>
  (move: (state: TetriminoState) => TetriminoState) => {
    const { shape, position, plane } = move(state);
    const testingPosition = calculateMatrix(shape, position, plane);
    return !detectCollision(testingPosition, board);
  };
