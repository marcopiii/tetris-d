import { match } from 'ts-pattern';
import { COLS } from '../params';
import {
  Name as TetriminoType,
  RotationState,
  Shape,
  wallKickData,
} from '../tetrimino';

type Plane = 'x' | 'z';

export function initPosition(plane: Plane, shape: Shape) {
  return plane === 'x'
    ? {
        x: Math.floor((COLS - 1) / 2),
        z: Math.ceil((COLS - 1 - shape.length) / 2),
        y: 0,
      }
    : {
        x: Math.ceil((COLS - 1 - shape.length) / 2),
        z: Math.floor((COLS - 1) / 2),
        y: 0,
      };
}

export type TetriminoState = {
  readonly type: TetriminoType;
  readonly plane: Plane;
  position: { x: number; y: number; z: number };
  shape: Shape;
  rotationState: RotationState;
};

export function drop(state: TetriminoState): TetriminoState {
  return {
    ...state,
    position: { ...state.position, y: state.position.y + 1 },
  };
}

export function shiftRight(state: TetriminoState): TetriminoState {
  return match(state.plane)
    .with('x', () => ({
      ...state,
      position: { ...state.position, z: state.position.z + 1 },
    }))
    .with('z', () => ({
      ...state,
      position: { ...state.position, x: state.position.x + 1 },
    }))
    .exhaustive();
}

export function shiftLeft(state: TetriminoState): TetriminoState {
  return match(state.plane)
    .with('x', () => ({
      ...state,
      position: { ...state.position, z: state.position.z - 1 },
    }))
    .with('z', () => ({
      ...state,
      position: { ...state.position, x: state.position.x - 1 },
    }))
    .exhaustive();
}

export function shiftBackward(state: TetriminoState): TetriminoState {
  return match(state.plane)
    .with('x', () => ({
      ...state,
      position: { ...state.position, x: state.position.x - 1 },
    }))
    .with('z', () => ({
      ...state,
      position: { ...state.position, z: state.position.z - 1 },
    }))
    .exhaustive();
}

export function shiftForward(state: TetriminoState): TetriminoState {
  return match(state.plane)
    .with('x', () => ({
      ...state,
      position: { ...state.position, x: state.position.x + 1 },
    }))
    .with('z', () => ({
      ...state,
      position: { ...state.position, z: state.position.z + 1 },
    }))
    .exhaustive();
}

function applyWallKick(offset: [number, number]) {
  return (state: TetriminoState): TetriminoState['position'] =>
    match(state.plane)
      .with('x', () => ({
        ...state.position,
        z: state.position.z + offset[0],
        y: state.position.y - offset[1],
      }))
      .with('z', () => ({
        ...state.position,
        x: state.position.x + offset[0],
        y: state.position.y - offset[1],
      }))
      .exhaustive();
}

export function rotateRight(wallKickTest: number) {
  return (state: TetriminoState): TetriminoState => {
    const finalRotationState = match(state.rotationState)
      .with('0', () => 'R' as const)
      .with('R', () => '2' as const)
      .with('2', () => 'L' as const)
      .with('L', () => '0' as const)
      .exhaustive();

    const wallKick = wallKickData(state.type).find(
      (wkd) =>
        wkd.initial === state.rotationState && wkd.final === finalRotationState,
    )!.tests[wallKickTest];

    const newShape = state.shape[0].map((_, i) =>
      state.shape.map((row) => row[i]).reverse(),
    );
    const newPosition = applyWallKick(wallKick)(state);
    return {
      ...state,
      shape: newShape,
      position: newPosition,
      rotationState: finalRotationState,
    };
  };
}

export function rotateLeft(wallKickTest: number) {
  return (state: TetriminoState): TetriminoState => {
    const finalRotationState = match(state.rotationState)
      .with('0', () => 'L' as const)
      .with('L', () => '2' as const)
      .with('2', () => 'R' as const)
      .with('R', () => '0' as const)
      .exhaustive();

    const wallKick = wallKickData(state.type).find(
      (wkd) =>
        wkd.initial === state.rotationState && wkd.final === finalRotationState,
    )!.tests[wallKickTest];

    const newShape = state.shape[0].map((_, i) =>
      state.shape.map((row) => row[row.length - 1 - i]),
    );
    const newPosition = applyWallKick(wallKick)(state);
    return {
      ...state,
      shape: newShape,
      position: newPosition,
      rotationState: finalRotationState,
    };
  };
}
