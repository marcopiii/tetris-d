import React, { useState } from 'react';
import { match } from 'ts-pattern';
import { FX, play } from '~/audio';
import { useGamepadManager, useKeyboardManager } from '~/controls';
import { spinDetector } from '~/scene/Play/Game/gameplay/score/spinDetector';
import { VANISH_ZONE_ROWS } from './params';
import { BagAction, CameraAction, CutAction, Actions } from './types';
import { useCamera } from '~/scene/shared';
import BagPanel from './BagPanel';
import Board from './Board';
import ScoreEventStream from './ScoreEventStream';
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
  Progress,
  TetriminoState,
} from './gameplay';
import Ghost from './Ghost';
import ProgressPanel from './ProgressPanel';
import Tetrimino from './Tetrimino';
import Tetrion from './Tetrion';
import { PlaneCoords } from './types';
import { gravity } from './gameplay/gravity/useGravity';

type Props = {
  onGameOver: (progress: Progress) => void;
};

export default function Game(props: Props) {
  const plane = usePlane();
  const bag = useBag();

  const [rotated, setRotated] = useState(false);
  const [isDropping, setIsDropping] = useState(false);

  const { progress, scoreEventStream, trackProgress } = useScoreTracker();

  const { tetrimino, attempt, hardDrop, projectGhost } = useTetriminoManager(
    bag.current,
    plane.current,
  );

  const { board, fixPiece, deleteLines } = useBoardManager({
    onLinesDeleted: (clearedPlanes, cascadeCompletedLines) => {
      if (clearedPlanes.length > 0) {
        play(FX.perfect_clear, 0.75);
      }
      trackProgress.perfectClear(clearedPlanes);
      if (cascadeCompletedLines.length > 0) {
        play(FX.line_clear, 0.75);
      }
      trackProgress.lineClear(cascadeCompletedLines);
    },
    onPieceFixed: (completedLines) => {
      const spinData = spinDetector(lastMoveSpinDataRef.current, board);
      if (completedLines.length > 0) {
        play(FX.line_clear, 0.75);
      }
      trackProgress.lineClear(completedLines);
      trackProgress.tSpin(spinData, completedLines);
    },
  });

  const ghost = projectGhost(board);

  const hasHardDroppedRef = React.useRef(false);

  const lastMoveSpinDataRef =
    React.useRef<Omit<TetriminoState, 'shape'>>(undefined);

  const { triggerLock, cancelLock, canReset, lockTimer } = useLockDelay(() => {
    const isInVanishZone = tetrimino.every(({ y }) => y < VANISH_ZONE_ROWS);
    if (isInVanishZone) {
      props.onGameOver(progress);
    } else {
      fixPiece(bag.current, tetrimino);
      bag.pullNext();
      plane.change();
      play(FX.lock, 0.15);
      hasHardDroppedRef.current = false;
    }
  });

  useGravity(
    () => {
      const deletedLines = deleteLines();
      const dropSuccess = !!attempt(drop)(board);
      if (deletedLines.length > 0 || dropSuccess) {
        lastMoveSpinDataRef.current = undefined;
      }
    },
    isDropping
      ? Math.min(progress.level + 5, gravity.length - 1)
      : progress.level,
  );

  // every time the tetrimino moves, by player action or gravity
  React.useEffect(() => {
    const shouldLock = tetrimino.every((t) =>
      ghost.some((g) => g.x === t.x && g.y === t.y && g.z === t.z),
    );
    shouldLock ? triggerLock() : cancelLock();
  }, [tetrimino]);

  const [camera, setCamera, relativeAxis] = useCamera({
    c1: { position: [-10, 5, 10], lookAt: [0, 1, 0] },
    c2: { position: [10, 5, 10], lookAt: [0, 1, 0] },
    c3: { position: [10, 5, -10], lookAt: [0, 1, 0] },
    c4: { position: [-10, 5, -10], lookAt: [0, 1, 0] },
  });

  const [cut, setCut] = useCutter(plane.current, relativeAxis);

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
    const relativeSide = match(action)
      .with('cutL', () => 'left' as const)
      .with('cutR', () => 'right' as const)
      .exhaustive();
    setCut(apply, relativeSide);
  }

  function moveAction(action: Actions) {
    if (hasHardDroppedRef.current || !canReset) {
      return;
    }
    const [rxInverted, fwInverted] = match(plane.current)
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
      .with('shiftL', () => {
        const shift = rxInverted ? shiftRight : shiftLeft;
        const mutatedTetriminoState = attempt(shift)(board);
        if (mutatedTetriminoState) {
          lastMoveSpinDataRef.current = undefined;
        }
        return !!mutatedTetriminoState;
      })
      .with('shiftR', () => {
        const shift = rxInverted ? shiftLeft : shiftRight;
        const mutatedTetriminoState = attempt(shift)(board);
        if (mutatedTetriminoState) {
          lastMoveSpinDataRef.current = undefined;
        }
        return !!mutatedTetriminoState;
      })
      .with('shiftF', () => {
        const shift = fwInverted ? shiftBackward : shiftForward;
        const mutatedTetriminoState = attempt(shift)(board);
        if (mutatedTetriminoState) {
          lastMoveSpinDataRef.current = undefined;
        }
        return !!mutatedTetriminoState;
      })
      .with('shiftB', () => {
        const shift = fwInverted ? shiftForward : shiftBackward;
        const mutatedTetriminoState = attempt(shift)(board);
        if (mutatedTetriminoState) {
          lastMoveSpinDataRef.current = undefined;
        }
        return !!mutatedTetriminoState;
      })
      .with('rotateL', () => {
        for (let i = 0; i < 5; i++) {
          const rotation = rxInverted ? rotateRight(i) : rotateLeft(i);
          const mutatedTetriminoState = attempt(rotation)(board);
          if (mutatedTetriminoState) {
            lastMoveSpinDataRef.current = mutatedTetriminoState;
            return true;
          }
        }
        return false;
      })
      .with('rotateR', () => {
        for (let i = 0; i < 5; i++) {
          const rotation = rxInverted ? rotateLeft(i) : rotateRight(i);
          const mutatedTetriminoState = attempt(rotation)(board);
          if (mutatedTetriminoState) {
            lastMoveSpinDataRef.current = mutatedTetriminoState;
            return true;
          }
        }
        return false;
      })
      .with('hDrop', () => {
        const dropLength = hardDrop(board);
        if (dropLength > 0) {
          lastMoveSpinDataRef.current = undefined;
          trackProgress.hardDrop(dropLength);
        }
        return true;
      })
      .with('startDrop', () => setIsDropping(true))
      .with('stopDrop', () => setIsDropping(false))
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
        .otherwise(() => undefined);

      if (fx) {
        play(fx, 0.15);
      }
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
      .with(['release', 'KeyC'], () => cutterAction('cutR', 'remove'))
      .otherwise(() => null),
  );

  useGamepadManager(
    (event, button) =>
      match([event, button])
        .with(['press', 'padL'], () => moveAction('shiftL'))
        .with(['press', 'padR'], () => moveAction('shiftR'))
        .with(['press', 'padU'], () => moveAction('shiftF'))
        .with(['press', 'padD'], () => moveAction('shiftB'))
        .with(['press', 'X'], () => moveAction('hDrop'))
        .with(['press', 'B'], () => moveAction('rotateR'))
        .with(['press', 'A'], () => moveAction('rotateL'))
        .with(['press', 'LB'], () => moveAction('startDrop'))
        .with(['release', 'LB'], () => moveAction('stopDrop'))
        .with(['press', 'RB'], () => bagAction('hold'))
        .with(['press', 'LT'], () => cutterAction('cutL', 'apply'))
        .with(['release', 'LT'], () => cutterAction('cutL', 'remove'))
        .with(['press', 'RT'], () => cutterAction('cutR', 'apply'))
        .with(['release', 'RT'], () => cutterAction('cutR', 'remove'))
        .otherwise(() => null),
    (axis) =>
      match({ axis, rotated })
        .with({ axis: { which: 'right', x: -1.0 }, rotated: false }, () => {
          setRotated(true);
          cameraAction('cameraL');
        })
        .with({ axis: { which: 'right', x: 1.0 }, rotated: false }, () => {
          setRotated(true);
          cameraAction('cameraR');
        })
        .with({ axis: { which: 'right', x: 0 } }, () => setRotated(false))
        .otherwise(() => {}),
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
      <ProgressPanel
        camera={camera}
        progress={progress}
        scoreEventStream={scoreEventStream}
      />
      <BagPanel camera={camera} next={bag.next} hold={bag.hold} />
      <Board occupiedBlocks={board} cutting={boardCuttingProp} />
      <Tetrimino
        type={bag.current}
        occupiedBlocks={tetrimino}
        lockTimer={lockTimer}
      />
      <Ghost type={bag.current} occupiedBlocks={ghost} />
      <ScoreEventStream
        camera={{ position: camera, relativeAxis }}
        scoreEventStream={scoreEventStream}
      />
    </group>
  );
}
