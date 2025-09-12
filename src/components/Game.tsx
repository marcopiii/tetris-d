import React from 'react';
import { match, P } from 'ts-pattern';
import FX from '../audio';
import { VANISH_ZONE_ROWS } from '../params';
import { play } from '../utils';
import BagPanel from './BagPanel';
import Board from './Board';
import { PlaneCoords } from './Coords';
import Ghost from './Ghost';
import ProgressPanel from './ProgressPanel';
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
import useCutter from './useCutter';
import useGamepadManager from './useGamepadManager';
import { useKeyboardManager } from './useKeyboardManager';
import usePlane from './usePlane';
import useCamera from './useCamera';
import useScoreTracker from './useScoreTracker';
import useTetriminoManager from './useTetriminoManager';

export default function Game() {
  const plane = usePlane();
  const bag = useBag();

  const { board, fixPiece, checkLines } = useBoardManager();
  const { tetrimino, attempt, projectGhost } = useTetriminoManager(
    bag.current,
    plane.current,
  );

  const [camera, setCamera, relativeAxis] = useCamera({
    c1: { position: [-10, 5, 10], lookAt: [0, 1, 0] },
    c2: { position: [10, 5, 10], lookAt: [0, 1, 0] },
    c3: { position: [10, 5, -10], lookAt: [0, 1, 0] },
    c4: { position: [-10, 5, -10], lookAt: [0, 1, 0] },
  });

  const [cut, setCut] = useCutter(camera);

  const { score, level, addLines } = useScoreTracker();

  const tick = () => {
    checkLines(true);
    const collision = !attempt(drop)(board);
    if (collision) {
      if (tetrimino.every(({ y }) => y < VANISH_ZONE_ROWS)) {
        // game over
        clock.toggle();
        alert(`Game Over! Your score: ${score}`);
        return;
      }
      fixPiece(bag.current, tetrimino);
      // note: the board change caused by fixing the piece will trigger a
      // re-render that may be applied before the bag pull
      bag.pullNext();
      plane.change();
    }
  };

  // update the score as soon as the board is changed, while the lines
  // will be cleared in the next tick
  React.useEffect(() => {
    const completedLines = checkLines(false);
    if (completedLines.length > 0) {
      play(FX.line_clear, 0.75);
    }
    addLines(completedLines);
  }, [checkLines]);

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

  function cutterAction(action: 'cut' | 'uncut', side: 'left' | 'right') {
    const fwRx = match(plane.current)
      .with('x', () => relativeAxis.x.forwardRight)
      .with('z', () => relativeAxis.z.forwardRight)
      .exhaustive();
    match(side)
      .with('right', () => setCut(action, fwRx ? 'above' : 'below'))
      .with('left', () => setCut(action, fwRx ? 'below' : 'above'))
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
    const success = match(action)
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
            return true;
        }
        return false;
      })
      .with('rotateR', () => {
        for (let i = 0; i < 5; i++) {
          if (attempt(rightInverted ? rotateLeft(i) : rotateRight(i))(board))
            return true;
        }
        return false;
      })
      .exhaustive();
    if (success) {
      const fx = match(action)
        .with('shiftL', () => FX.tetrimino_move)
        .with('shiftR', () => FX.tetrimino_move)
        .with('shiftF', () => FX.tetrimino_move)
        .with('shiftB', () => FX.tetrimino_move)
        .with('rotateL', () => FX.tetrimino_rotate)
        .with('rotateR', () => FX.tetrimino_rotate)
        .exhaustive();
      play(fx, 0.15);
    }
  }

  const clock = useClock(tick);

  useKeyboardManager((event, button) =>
    match([clock.isRunning, event, button])
      .with([P.any, 'press', 'Enter'], () => clock.toggle())
      .with([true, 'press', 'KeyA'], () => gameAction('shiftL'))
      .with([true, 'press', 'KeyD'], () => gameAction('shiftR'))
      .with([true, 'press', 'KeyS'], () => gameAction('shiftB'))
      .with([true, 'press', 'KeyW'], () => gameAction('shiftF'))
      .with([true, 'press', 'KeyQ'], () => gameAction('rotateL'))
      .with([true, 'press', 'KeyE'], () => gameAction('rotateR'))
      .with([true, 'press', 'KeyX'], () => bag.switchHold?.())
      .with([true, 'press', 'ArrowLeft'], () => cameraAction('left'))
      .with([true, 'press', 'ArrowRight'], () => cameraAction('right'))
      .with([true, 'press', 'KeyZ'], () => cutterAction('cut', 'left'))
      .with([true, 'release', 'KeyZ'], () => cutterAction('uncut', 'left'))
      .with([true, 'press', 'KeyC'], () => cutterAction('cut', 'right'))
      .with([true, 'release', 'KeyC'], () => cutterAction('uncut', 'right'))
      .otherwise(() => null),
  );

  useGamepadManager((event, button) =>
    match([clock.isRunning, event, button])
      .with([P.any, 'press', 'start'], () => clock.toggle())
      .with([true, 'press', 'padL'], () => gameAction('shiftL'))
      .with([true, 'press', 'padR'], () => gameAction('shiftR'))
      .with([true, 'press', 'padU'], () => gameAction('shiftB'))
      .with([true, 'press', 'padD'], () => gameAction('shiftF'))
      .with([true, 'press', 'X'], () => gameAction('rotateL'))
      .with([true, 'press', 'B'], () => gameAction('rotateR'))
      .with([true, 'press', 'Y'], () => bag.switchHold?.())
      .with([true, 'press', 'LT'], () => cameraAction('left'))
      .with([true, 'press', 'RT'], () => cameraAction('right'))
      .with([true, 'press', 'LB'], () => cutterAction('cut', 'left'))
      .with([true, 'release', 'LB'], () => cutterAction('uncut', 'left'))
      .with([true, 'press', 'RB'], () => cutterAction('cut', 'right'))
      .with([true, 'release', 'RB'], () => cutterAction('uncut', 'right'))
      .otherwise(() => null),
  );

  const boardCuttingProp = React.useMemo(
    () => ({
      plane: { [plane.current]: tetrimino[0][plane.current] } as PlaneCoords,
      below: cut.below,
      above: cut.above,
    }),
    [tetrimino, plane.current, cut.below, cut.above],
  );

  // todo: avoid unnecessary re-renders
  return (
    <group>
      <Tetrion />
      <ProgressPanel camera={camera} score={score} level={level} />
      <BagPanel camera={camera} next={bag.next} hold={bag.hold} />
      <Board occupiedBlocks={board} cutting={boardCuttingProp} />
      <Tetrimino type={bag.current} occupiedBlocks={tetrimino} />
      <Ghost type={bag.current} occupiedBlocks={projectGhost(board)} />
    </group>
  );
}
