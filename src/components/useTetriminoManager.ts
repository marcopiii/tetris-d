import React from 'react';
import { Vector3Like } from 'three';
import { COLS, ROWS } from '../params';
import { tetriminos } from '../tetrimino';
import {
  Name as TetriminoType,
  RotationState,
  Shape,
} from '../tetrimino/types';
import { initPosition, TetriminoState } from './tetriminoMovement';

export default function useTetriminoManager(
  type: TetriminoType,
  plane: 'x' | 'z',
) {
  const [rotationState, setRotationState] = React.useState<RotationState>('0');
  const [position, setPosition] = React.useState(
    initPosition(plane, tetriminos[type]),
  );
  const [shape, setShape] = React.useState<Shape>(tetriminos[type]);

  React.useEffect(() => {
    setRotationState('0');
    setShape(tetriminos[type]);
    setPosition(initPosition(plane, tetriminos[type]));
  }, [type, plane]);

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
   * The array of the coordinates of the blocks that are currently occupied by the tetrimino,
   * relative to the board coordinate system.
   */
  const tetrimino: { x: number; y: number; z: number }[] = React.useMemo(
    () => calculateMatrix(shape, position, plane),
    [shape, position, plane],
  );

  function detectCollision(
    tetriminoMatrix: Vector3Like[],
    boardMatrix: Vector3Like[],
  ) {
    const floorCollision = tetriminoMatrix.some(({ y }) => y >= ROWS);
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

  /**
   * Attempts to apply the given move function to the tetrimino inside the given board.
   * Returns true if the move was successful and the tetrimino state actually changed, false otherwise.
   */
  const attempt = React.useCallback(
    (moveFn: (state: TetriminoState) => TetriminoState) =>
      (boardMatrix: Vector3Like[]) => {
        const currentState: TetriminoState = {
          type,
          plane,
          position,
          shape,
          rotationState,
        };
        const newState = moveFn(currentState);
        const newTetriminoMatrix = calculateMatrix(
          newState.shape,
          newState.position,
          newState.plane,
        );
        const collision = detectCollision(newTetriminoMatrix, boardMatrix);
        if (collision) {
          return false;
        } else {
          setPosition(newState.position);
          setShape(newState.shape);
          setRotationState(newState.rotationState);
          return true;
        }
      },
    [type, plane, position, shape, rotationState],
  );

  return { tetrimino, attempt };
}
