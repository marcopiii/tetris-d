import { noop } from 'es-toolkit';
import React from 'react';
import { match } from 'ts-pattern';
import { FX, play } from '~/audio';
import { useGamepadManager, useKeyboardManager } from '~/controls';
import { RelativeSide } from '~/scene/Play/Game/gameplay/cutter/types';
import { spinDetector } from '~/scene/Play/Game/gameplay/score/spinDetector';
import { useControlsMiddleware } from '~/scene/shared/camera/useControlsMiddleware';
import { VANISH_ZONE_ROWS } from './params';
import { BagAction, CameraAction, Actions } from './types';
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

type Props = {
  onGameOver: (progress: Progress) => void;
};

export default function Game(props: Props) {
  const plane = usePlane();
  const bag = useBag();

  const { progress, scoreEventStream, track } = useScoreTracker();

  const { tetrimino, attempt, hardDrop, projectGhost } = useTetriminoManager(
    bag.current,
    plane.current,
  );

  const { board, fixPiece, deleteLines } = useBoardManager({
    onLinesDeleted: (clearedPlanes, cascadeCompletedLines) => {
      if (clearedPlanes.length > 0) {
        play(FX.perfect_clear, 0.75);
      }
      if (cascadeCompletedLines.length > 0) {
        play(FX.line_clear, 0.75);
        triggerLineDeletionPhase();
      } else {
        endLineDeletionPhase();
      }
      track({
        perfectClear: clearedPlanes,
        clearing: {
          lines: cascadeCompletedLines,
          isCascade: true,
        },
      });
    },
    onPieceFixed: (completedLines) => {
      const spinData = spinDetector(lastMoveSpinDataRef.current, board);
      lastMoveSpinDataRef.current = undefined;
      hasHardDroppedRef.current = false;
      track({
        clearing: { lines: completedLines, isCascade: false },
        rewardingMove: spinData && { move: 't-spin', ...spinData },
      });
      if (completedLines.length > 0) {
        play(FX.line_clear, 0.75);
        triggerLineDeletionPhase();
      }
    },
  });

  const ghost = projectGhost(board);

  const lastMoveSpinDataRef =
    React.useRef<Omit<TetriminoState, 'shape'>>(undefined);

  const { triggerLock, cancelLock, canReset, lockTimer } = useLockDelay(() => {
    const isInVanishZone = tetrimino.every(({ y }) => y < VANISH_ZONE_ROWS);
    if (isInVanishZone) {
      props.onGameOver(progress);
    } else {
      fixPiece(bag.current, tetrimino);
      play(FX.lock, 0.15);
      bag.pullNext();
      plane.change();
    }
  });

  const hasHardDroppedRef = React.useRef(false);
  const isOnLineDeletionPhaseRef = React.useRef(false);
  const isOnPauseRef = React.useRef(false);

  const { pauseGravity, resumeGravity } = useGravity(() => {
    const dropSuccess = !!attempt(drop)(board);
    if (dropSuccess) {
      lastMoveSpinDataRef.current = undefined;
    }
  }, progress.level);

  const triggerLineDeletionPhase = () => {
    isOnLineDeletionPhaseRef.current = true;
    pauseGravity();
    setTimeout(() => deleteLines(), 500);
  };

  const endLineDeletionPhase = () => {
    isOnLineDeletionPhaseRef.current = false;
    resumeGravity();
  };

  // every time the tetrimino moves, by player action or gravity
  React.useEffect(() => {
    const shouldLock = tetrimino.every((t) =>
      ghost.some((g) => g.x === t.x && g.y === t.y && g.z === t.z),
    );
    shouldLock ? triggerLock() : cancelLock();
  }, [tetrimino]);

  const { camera, setCamera, tiltCamera, relativeAxes } = useCamera({
    c1: { position: [-10, 5, 10], lookAt: [0, 1, 0] },
    c2: { position: [10, 5, 10], lookAt: [0, 1, 0] },
    c3: { position: [10, 5, -10], lookAt: [0, 1, 0] },
    c4: { position: [-10, 5, -10], lookAt: [0, 1, 0] },
  });

  const [cut, setCut] = useCutter(plane.current, relativeAxes);

  function cutterAction(side: RelativeSide, value: number) {
    if (isOnPauseRef.current) return;
    setCut(side, value);
  }

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

  function togglePause() {
    if (isOnPauseRef.current) {
      isOnPauseRef.current = false;
      resumeGravity();
    } else {
      isOnPauseRef.current = true;
      pauseGravity();
    }
  }

  const isInteractionBlocked = () =>
    isOnPauseRef.current ||
    hasHardDroppedRef.current ||
    isOnLineDeletionPhaseRef.current ||
    !canReset;

  function moveAction(action: Actions) {
    if (isInteractionBlocked()) {
      return;
    }
    const [rxInverted, fwInverted] = match(plane.current)
      .with('x', () => [
        relativeAxes.z.rightInverted,
        relativeAxes.x.forwardInverted,
      ])
      .with('z', () => [
        relativeAxes.x.rightInverted,
        relativeAxes.z.forwardInverted,
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
          track({
            rewardingMove: {
              move: 'hard-drop',
              length: dropLength,
            },
          });
        }
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
    if (isInteractionBlocked()) {
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
      .otherwise(noop),
  );

  const handleRightStickInput = useControlsMiddleware({
    onHardLeft: () => cameraAction('cameraL'),
    onHardRight: () => cameraAction('cameraR'),
    onTilt: ({ x, y }) => tiltCamera(x, y),
  });

  useGamepadManager(
    (event, button) =>
      match([event, button])
        .with(['press', 'padL'], () => moveAction('shiftL'))
        .with(['press', 'padR'], () => moveAction('shiftR'))
        .with(['press', 'padU'], () => moveAction('shiftF'))
        .with(['press', 'padD'], () => moveAction('shiftB'))
        .with(['press', 'X'], () => moveAction('rotateL'))
        .with(['press', 'B'], () => moveAction('rotateR'))
        .with(['press', 'A'], () => moveAction('hDrop'))
        .with(['press', 'Y'], () => bagAction('hold'))
        .with(['press', 'start'], () => togglePause())
        .otherwise(noop),
    (status, trigger) => {
      match(trigger)
        .with('LT', () => cutterAction('left', status))
        .with('RT', () => cutterAction('right', status))
        .exhaustive();
    },
    (status, stick) => {
      if (stick === 'right') {
        handleRightStickInput(status);
      }
    },
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
        camera={{ position: camera, relativeAxes }}
        scoreEventStream={scoreEventStream}
      />
    </group>
  );
}
