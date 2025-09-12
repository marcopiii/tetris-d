import React from 'react';
import { Vector3Like } from 'three';
import { COLS, ROWS, VANISH_ZONE_ROWS } from '../params';
import { tetriminos } from '../tetrimino';
import { Name as TetriminoType, Shape } from '../tetrimino/types';
import { initPosition, TetriminoState } from './tetriminoMovement';

/**
 * Manages the state of a Tetrimino in the game.
 * This hook initializes the tetrimino state based on the given type and plane. Changing `type`
 * or `plane` will basically spawn a new tetrimino.
 * @param type
 * @param plane
 */
export default function useTetriminoManager(
  type: TetriminoType,
  plane: 'x' | 'z',
) {
  const [state, setState] = React.useState<TetriminoState>({
    type,
    plane,
    position: initPosition(plane, tetriminos[type]),
    shape: tetriminos[type],
    rotationState: '0',
  });

  React.useEffect(() => {
    setState({
      type,
      plane,
      position: initPosition(plane, tetriminos[type]),
      shape: tetriminos[type],
      rotationState: '0',
    });
  }, [type, plane]);

  /**
   * The array of the coordinates of the blocks that are currently occupied by the tetrimino,
   * relative to the board coordinate system.
   */
  const tetrimino = React.useMemo(
    () => calculateMatrix(state.shape, state.position, state.plane),
    [state.shape, state.position, state.plane],
  );

  /**
   * Attempts to apply the given move function to the tetrimino inside the given board.
   * Returns true if the move was successful and the tetrimino state actually changed, false otherwise.
   */
  const attempt = React.useCallback(
    (moveFn: (state: TetriminoState) => TetriminoState) =>
      (boardMatrix: Vector3Like[]) => {
        const newState = moveFn(state);
        const newTetriminoMatrix = calculateMatrix(
          newState.shape,
          newState.position,
          newState.plane,
        );
        const collision = detectCollision(newTetriminoMatrix, boardMatrix);
        if (collision) {
          return false;
        } else {
          setState(newState);
          return true;
        }
      },
    [state],
  );

  /**
   * Projects the ghost of the current tetrimino onto the given board.
   */
  const projectGhost = (boardMatrix: Vector3Like[]) => {
    const ghostPosition = { ...state.position };
    let ghostMatrix = calculateMatrix(state.shape, ghostPosition, state.plane);
    if (detectCollision(ghostMatrix, boardMatrix)) {
      // if the current piece matrix is already in collision, it is because the piece
      // is being fixed in the board, so we don't show any ghost
      return [];
    }
    while (!detectCollision(ghostMatrix, boardMatrix)) {
      ghostPosition.y++;
      ghostMatrix = calculateMatrix(state.shape, ghostPosition, state.plane);
    }
    ghostPosition.y--;
    ghostMatrix = calculateMatrix(state.shape, ghostPosition, state.plane);
    return ghostMatrix.filter(
      (g) => !tetrimino.some((t) => t.x === g.x && t.y === g.y && t.z === g.z),
    );
  };

  return { tetrimino, attempt, projectGhost };
}

function calculateMatrix(
  shape: Shape,
  position: Vector3Like,
  plane: 'x' | 'z',
) {
  return shape
    .flatMap((layer, dy) =>
      layer.map((exists, k) => {
        if (!exists) return undefined;
        const dx = plane === 'x' ? 0 : k;
        const dz = plane === 'z' ? 0 : k;
        return {
          y: position.y + dy,
          x: position.x + dx,
          z: position.z + dz,
        };
      }),
    )
    .filter((b) => !!b);
}

/**
 * Detects if the given tetrimino collides with the given board. A collision can be:
 * - floor collision: any block of the tetrimino is below the floor
 * - wall collision: any block of the tetrimino is outside the walls
 * - stack collision: any block of the tetrimino overlaps with any block of the board
 */
function detectCollision(
  tetriminoMatrix: Vector3Like[],
  boardMatrix: Vector3Like[],
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
