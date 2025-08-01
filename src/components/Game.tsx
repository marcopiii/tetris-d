import React from 'react';
import { match } from 'ts-pattern';
import { LineCoord } from '../scenario/game/types';
import Board from './Board';
import Tetrimino from './Tetrimino';
import {
  drop,
  rotateLeft,
  rotateRight,
  shiftBackward,
  shiftForward,
  shiftLeft,
  shiftRight,
} from './tetriminoMovement';
import Tetrion from './Tetrion';
import useBag from './useBag';
import useBoardManager from './useBoardManager';
import useClock from './useClock';
import { useKeyboardManager } from './useKeyboardManager';
import usePlane from './usePlane';
import useCamera from './useCamera';
import useTetriminoManager from './useTetriminoManager';

export default function Game() {
  const plane = usePlane();
  const bag = useBag();

  const { board, fixPiece } = useBoardManager();
  const { tetrimino, attempt } = useTetriminoManager(
    bag.current,
    plane.current,
  );

  const tick = (): [LineCoord[], boolean] => {
    const collision = !attempt(drop)(board);
    if (collision) {
      fixPiece(tetrimino);
      bag.pullNext();
      plane.change();
      return [[], false];
    }
    return [[], false];
  };
  
  const [camera, setCamera] = useCamera({
    c1: { position: [-10, 4, 10], lookAt: [0, 0, 0] },
    c2: { position: [10, 4, 10], lookAt: [0, 0, 0] },
    c3: { position: [10, 4, -10], lookAt: [0, 0, 0] },
    c4: { position: [-10, 4, -10], lookAt: [0, 0, 0] },
  });

  function cameraAction(action: 'left' | 'right') {
    match([camera, action])
      .with(['c1', 'right'], () => setCamera('c2'))
      .with(['c2', 'right'], () => setCamera('c3'))
      .with(['c3', 'right'], () => setCamera('c4'))
      .with(['c4', 'right'], () => setCamera('c1'))
      .with(['c1', 'left'], () => setCamera('c4'))
      .with(['c4', 'left'], () => setCamera('c3'))
      .with(['c3', 'left'], () => setCamera('c2'))
      .with(['c2', 'left'], () => setCamera('c1'))
      .exhaustive();
  }

  const clock = useClock(tick);

  useKeyboardManager((event, button) =>
    match([event, button])
      .with(['press', 'Enter'], () => clock.toggle())
      .with(['press', 'KeyA'], () => attempt(shiftLeft)(board))
      .with(['press', 'KeyD'], () => attempt(shiftRight)(board))
      .with(['press', 'KeyS'], () => attempt(shiftForward)(board))
      .with(['press', 'KeyW'], () => attempt(shiftBackward)(board))
      .with(['press', 'KeyQ'], () => attempt(rotateLeft(0))(board))
      .with(['press', 'KeyE'], () => attempt(rotateRight(0))(board))
      .with(['press', 'ArrowLeft'], () => cameraAction('left'))
      .with(['press', 'ArrowRight'], () => cameraAction('right'))
      .otherwise(() => null),
  );

  // todo: avoid unnecessary re-renders
  return (
    <group>
      <Tetrion />
      <Board occupiedBlocks={board} />
      <Tetrimino occupiedBlocks={tetrimino} />
    </group>
  );
}
