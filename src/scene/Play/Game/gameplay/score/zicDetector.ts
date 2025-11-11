import { calculateMatrix } from '~/scene/Play/Game/gameplay/calculateMatrix';
import { detectCollision } from '~/scene/Play/Game/gameplay/detectCollision';
import { ZicData } from './TrackEvent';
import { TetriminoState, undrop } from '../../gameplay';
import { Tetrimino } from '~/tetrimino';

export function zicDetector(
  state: TetriminoState | undefined,
  board: { type: Tetrimino; x: number; y: number; z: number }[],
): ZicData | undefined {
  if (!state) return undefined;

  const { shape, position, plane } = undrop(state);
  const undropped = calculateMatrix(shape, position, plane);
  const cantBeUndropped = detectCollision(undropped, board);

  return cantBeUndropped ? { kind: 'full' } : undefined;
}
