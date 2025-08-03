import React from 'react';
import { match } from 'ts-pattern';
import Board from './Board';
import Tetrimino from './Tetrimino';
import {
  drop,
  rotateLeft,
  rotateRight,
  shiftForward,
  shiftBackward,
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
import useScoreTracker from './useScoreTracker';
import useTetriminoManager from './useTetriminoManager';

export default function Game() {
  const plane = usePlane();
  const bag = useBag();

  const { board, fixPiece, clearLines } = useBoardManager();
  const { tetrimino, attempt } = useTetriminoManager(
    bag.current,
    plane.current,
  );

  const [score, addLines] = useScoreTracker();

  const tick = () => {
    const clearedLines = clearLines();
    const collision = !attempt(drop)(board);
    if (collision) {
      fixPiece(bag.current, tetrimino);
      bag.pullNext();
      plane.change();
    }
    addLines(clearedLines);
  };

  const [camera, setCamera, relativeAxis] = useCamera({
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

  function gameAction(
    action: 'shiftL' | 'shiftR' | 'shiftF' | 'shiftB' | 'rotateL' | 'rotateR',
  ) {
    const [rightInverted, forwardInverted] = match(plane.current)
      .with('x', () => [
        relativeAxis.z.rightInverted,
        relativeAxis.x.forwardInverted,
      ])
      .with('z', () => [
        relativeAxis.x.rightInverted,
        relativeAxis.z.forwardInverted,
      ])
      .exhaustive();
    match(action)
      .with('shiftL', () =>
        attempt(rightInverted ? shiftRight : shiftLeft)(board),
      )
      .with('shiftR', () =>
        attempt(rightInverted ? shiftLeft : shiftRight)(board),
      )
      .with('shiftF', () =>
        attempt(forwardInverted ? shiftBackward : shiftForward)(board),
      )
      .with('shiftB', () =>
        attempt(forwardInverted ? shiftForward : shiftBackward)(board),
      )
      .with('rotateL', () => {
        for (let i = 0; i < 5; i++) {
          if (attempt(rightInverted ? rotateRight(i) : rotateLeft(i))(board))
            break;
        }
      })
      .with('rotateR', () => {
        for (let i = 0; i < 5; i++) {
          if (attempt(rightInverted ? rotateLeft(i) : rotateRight(i))(board))
            break;
        }
      })
      .exhaustive();
  }

  useKeyboardManager((event, button) =>
    match([event, button])
      .with(['press', 'Enter'], () => clock.toggle())
      .with(['press', 'KeyA'], () => gameAction('shiftL'))
      .with(['press', 'KeyD'], () => gameAction('shiftR'))
      .with(['press', 'KeyS'], () => gameAction('shiftB'))
      .with(['press', 'KeyW'], () => gameAction('shiftF'))
      .with(['press', 'KeyQ'], () => gameAction('rotateL'))
      .with(['press', 'KeyE'], () => gameAction('rotateR'))
      .with(['press', 'KeyX'], () => bag.switchHold?.())
      .with(['press', 'ArrowLeft'], () => cameraAction('left'))
      .with(['press', 'ArrowRight'], () => cameraAction('right'))
      .otherwise(() => null),
  );

  const clock = useClock(tick);

  // todo: avoid unnecessary re-renders
  return (
    <group>
      <Tetrion />
      <Board occupiedBlocks={board} />
      <Tetrimino type={bag.current} occupiedBlocks={tetrimino} />
    </group>
  );
}
