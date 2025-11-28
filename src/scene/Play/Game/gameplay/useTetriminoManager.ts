import React from 'react';
import { Vector3Like } from 'three';
import { calculateMatrix } from '~/scene/Play/Game/gameplay/calculateMatrix';
import { detectCollision } from '~/scene/Play/Game/gameplay/detectCollision';
import { Tetrimino, tetriminos } from '~/tetrimino';
import { MinoCoord, Plane } from '../types';
import initPosition from './initPosition';
import { type TetriminoState, drop } from './movement';

/**
 * Manages the state of a Tetrimino in the game.
 * This hook initializes the tetrimino state based on the given type and plane. Changing `type`
 * or `plane` will basically spawn a new tetrimino.
 * @param type
 * @param plane
 */
export default function useTetriminoManager(type: Tetrimino, plane: Plane) {
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
   * @return the new `TetriminoState` if the move was successful and the tetrimino state
   * actually changed, undefined otherwise.
   */
  const attempt =
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
        return undefined;
      } else {
        setState(newState);
        return newState;
      }
    };

  const hardDrop = (boardMatrix: Vector3Like[]) => {
    const canDrop = (s: TetriminoState) => {
      const newState = drop(s);
      const newTetriminoMatrix = calculateMatrix(
        newState.shape,
        newState.position,
        newState.plane,
      );
      const isValid = !detectCollision(newTetriminoMatrix, boardMatrix);
      return isValid ? newState : undefined;
    };
    let currentState = state;
    let nextState;
    let length = 0;
    do {
      nextState = canDrop(currentState);
      if (nextState) {
        currentState = nextState;
        length++;
      }
    } while (nextState);
    setState(currentState);
    return length;
  };

  /**
   * Projects the ghost of the current tetrimino onto the given board. It is
   * equivalent to the position the tetrimino would occupy if it were to hard drop.
   */
  const projectGhost = (boardMatrix: Vector3Like[]): MinoCoord[] => {
    const ghostPosition = { ...state.position };
    let ghostMatrix = calculateMatrix(state.shape, ghostPosition, state.plane);
    if (detectCollision(ghostMatrix, boardMatrix)) {
      // this can happen only when we are in the phase where the active piece has been inserted into the board,
      // but a new one has not yet spawned. In this phase the active piece is overlapping the board, and thus
      // the starting projection point of the ghost is already compenetrating the board.
      // In this case, we don't need a ghost at all.
      return [];
    }
    while (!detectCollision(ghostMatrix, boardMatrix)) {
      ghostPosition.y++;
      ghostMatrix = calculateMatrix(state.shape, ghostPosition, state.plane);
    }
    ghostPosition.y--;
    ghostMatrix = calculateMatrix(state.shape, ghostPosition, state.plane);
    return ghostMatrix;
  };

  return { tetrimino, attempt, hardDrop, projectGhost };
}
