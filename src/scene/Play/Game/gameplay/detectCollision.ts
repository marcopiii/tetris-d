import { COLS, ROWS, VANISH_ZONE_ROWS } from '~/scene/Play/Game/params';
import { MinoCoord } from '~/scene/Play/Game/types';

/**
 * Detects if the given tetrimino collides with the given board. A collision can be:
 * - floor collision: any block of the tetrimino is below the floor
 * - wall collision: any block of the tetrimino is outside the walls
 * - stack collision: any block of the tetrimino overlaps with any block of the board
 */
export function detectCollision(
  tetriminoMatrix: MinoCoord[],
  boardMatrix: MinoCoord[],
) {
  const floorCollision = tetriminoMatrix.some(
    ({ y }) => y >= ROWS + VANISH_ZONE_ROWS,
  );
  const wallCollision = tetriminoMatrix.some(
    ({ x, z }) => x < 0 || x >= COLS || z < 0 || z >= COLS,
  );
  const stackCollision = tetriminoMatrix.some(({ y: ty, x: tx, z: tz }) =>
    boardMatrix.some(
      ({ y: by, x: bx, z: bz }) => ty === by && tx === bx && tz === bz,
    ),
  );
  return floorCollision || wallCollision || stackCollision;
}
