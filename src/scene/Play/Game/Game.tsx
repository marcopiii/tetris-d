import React from 'react';
import { match } from 'ts-pattern';
import { FX, play } from '~/audio';
import { useGamepadManager, useKeyboardManager } from '~/controls';
import { VANISH_ZONE_ROWS } from './params';
import { BagAction, CameraAction, CutAction, Actions } from './types';
import { useCamera } from '~/scene/shared';
import BagPanel from './BagPanel';
import Board from './Board';
import GainDisplay from './GainDisplay';
import {
  drop,
  rotateLeft,
  rotateRight,
  shiftBackward,
  shiftForward,
  shiftLeft,
  shiftRight,
  useBag,
  useBoardManager,
  useGravity,
  useCutter,
  usePlane,
  useScoreTracker,
  useTetriminoManager,
  useLockDelay,
} from './gameplay';
import Ghost from './Ghost';
import ProgressPanel from './ProgressPanel';
import Tetrimino from './Tetrimino';
import Tetrion from './Tetrion';
import { PlaneCoords } from './types';

type Props = {
  onGameOver: (score: number, level: number) => void;
};

export default function Game(props: Props) {
  const plane = usePlane();
  const bag = useBag();

  const { board, fixPiece, checkLines } = useBoardManager();
  const { tetrimino, attempt, hardDrop, projectGhost } = useTetriminoManager(
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

  const { score, level, gainStream, trackLines, trackHardDrop } =
    useScoreTracker();

  const ghost = projectGhost(board);

  const hasHardDroppedRef = React.useRef(false);

  const { triggerLock, cancelLock, canReset, lockTimer } = useLockDelay(() => {
    const isInVanishZone = tetrimino.every(({ y }) => y < VANISH_ZONE_ROWS);
    if (isInVanishZone) {
      props.onGameOver(score, level);
    } else {
      fixPiece(bag.current, tetrimino);
      bag.pullNext();
      plane.change();
      play(FX.lock, 0.15);
      hasHardDroppedRef.current = false;
    }
  });

  useGravity(() => {
    checkLines(true);
    attempt(drop)(board);
  }, level);

  React.useEffect(() => {
    const shouldLock = tetrimino.every((t) =>
      ghost.some((g) => g.x === t.x && g.y === t.y && g.z === t.z),
    );
    shouldLock ? triggerLock() : cancelLock();
  }, [tetrimino]);

  React.useEffect(() => {
    const completedLines = checkLines(false);
    if (completedLines.length > 0) {
      play(FX.line_clear, 0.75);
    }
    trackLines(completedLines);
  }, [board]);

  function cameraAction(action: CameraAction) {
    match([camera, action])
      .with(['c1', 'cameraR'], () => setCamera('c2'))
      .with(['c2', 'cameraR'], () => setCamera('c3'))
      .with(['c3', 'cameraR'], () => setCamera('c4'))
      .with(['c4', 'cameraR'], () => setCamera('c1'))
      .with(['c1', 'cameraL'], () => setCamera('c4'))
      .with(['c4', 'cameraL'], () => setCamera('c3'))
      .with(['c3', 'cameraL'], () => setCamera('c2'))
      .with(['c2', 'cameraL'], () => setCamera('c1'))
      .exhaustive();
  }

  function cutterAction(action: CutAction, apply: 'apply' | 'remove') {
    const fwRx = match(plane.current)
      .with('x', () => relativeAxis.x.forwardRight)
      .with('z', () => relativeAxis.z.forwardRight)
      .exhaustive();
    match(action)
      .with('cutR', () => setCut(apply, fwRx ? 'above' : 'below'))
      .with('cutL', () => setCut(apply, fwRx ? 'below' : 'above'))
      .exhaustive();
  }

  function moveAction(action: Actions) {
    if (hasHardDroppedRef.current || !canReset) {
      return;
    }
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
          if (attempt(rightInverted ? rotateRight(i) : rotateLeft(i))(board)) {
            return true;
          }
        }
        return false;
      })
      .with('rotateR', () => {
        for (let i = 0; i < 5; i++) {
          if (attempt(rightInverted ? rotateLeft(i) : rotateRight(i))(board)) {
            return true;
          }
        }
        return false;
      })
      .with('hDrop', () => {
        hardDrop(board);
        return true;
      })
      .exhaustive();
    if (success) {
      hasHardDroppedRef.current = action === 'hDrop';
      const fx = match(action)
        .with('shiftL', () => FX.tetrimino_move)
        .with('shiftR', () => FX.tetrimino_move)
        .with('shiftF', () => FX.tetrimino_move)
        .with('shiftB', () => FX.tetrimino_move)
        .with('rotateL', () => FX.tetrimino_rotate)
        .with('rotateR', () => FX.tetrimino_rotate)
        .with('hDrop', () => FX.hard_drop)
        .exhaustive();
      play(fx, 0.15);
    }
  }

  function bagAction(_action: BagAction) {
    if (!canReset) {
      return;
    }
    bag.switchHold?.();
  }

  useKeyboardManager((event, button) =>
    match([event, button])
      .with(['press', 'KeyA'], () => moveAction('shiftL'))
      .with(['press', 'KeyD'], () => moveAction('shiftR'))
      .with(['press', 'KeyS'], () => moveAction('shiftB'))
      .with(['press', 'KeyW'], () => moveAction('shiftF'))
      .with(['press', 'KeyQ'], () => moveAction('rotateL'))
      .with(['press', 'KeyE'], () => moveAction('rotateR'))
      .with(['press', 'Space'], () => moveAction('hDrop'))
      .with(['press', 'KeyX'], () => bagAction('hold'))
      .with(['press', 'ArrowLeft'], () => cameraAction('cameraL'))
      .with(['press', 'ArrowRight'], () => cameraAction('cameraR'))
      .with(['press', 'KeyZ'], () => cutterAction('cutL', 'apply'))
      .with(['release', 'KeyZ'], () => cutterAction('cutL', 'remove'))
      .with(['press', 'KeyC'], () => cutterAction('cutR', 'apply'))
      .with(['release', 'KeyC'], () => cutterAction('cutL', 'remove'))
      .otherwise(() => null),
  );

  useGamepadManager((event, button) =>
    match([event, button])
      .with(['press', 'padL'], () => moveAction('shiftL'))
      .with(['press', 'padR'], () => moveAction('shiftR'))
      .with(['press', 'padU'], () => moveAction('shiftF'))
      .with(['press', 'padD'], () => moveAction('shiftB'))
      .with(['press', 'X'], () => moveAction('rotateL'))
      .with(['press', 'B'], () => moveAction('rotateR'))
      .with(['press', 'A'], () => moveAction('hDrop'))
      .with(['press', 'Y'], () => bagAction('hold'))
      .with(['press', 'LT'], () => cameraAction('cameraL'))
      .with(['press', 'RT'], () => cameraAction('cameraR'))
      .with(['press', 'LB'], () => cutterAction('cutL', 'apply'))
      .with(['release', 'LB'], () => cutterAction('cutL', 'remove'))
      .with(['press', 'RB'], () => cutterAction('cutR', 'apply'))
      .with(['release', 'RB'], () => cutterAction('cutL', 'remove'))
      .otherwise(() => null),
  );

  const boardCuttingProp = {
    plane: {
      [plane.current]: tetrimino[0][plane.current],
    } as PlaneCoords,
    below: cut.below,
    above: cut.above,
  };

  // todo: avoid unnecessary re-renders
  return (
    <group>
      <Tetrion />
      <ProgressPanel camera={camera} score={score} level={level} />
      <BagPanel camera={camera} next={bag.next} hold={bag.hold} />
      <Board occupiedBlocks={board} cutting={boardCuttingProp} />
      <Tetrimino
        type={bag.current}
        occupiedBlocks={tetrimino}
        lockTimer={lockTimer}
      />
      <Ghost type={bag.current} occupiedBlocks={ghost} />
      {Object.entries(gainStream).map(([key, gain]) => (
        <GainDisplay
          camera={{ position: camera, relativeAxis }}
          gain={gain}
          key={key}
        />
      ))}
    </group>
  );
}
