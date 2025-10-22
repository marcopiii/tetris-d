import React from 'react';
import { match } from 'ts-pattern';
import { FX, play } from '~/audio';
import { useGamepadManager, useKeyboardManager } from '~/controls';
import { useLockDelay } from '~/scene/Play/Game/gameplay/useLockDelay';
import { VANISH_ZONE_ROWS } from '~/scene/Play/Game/params';
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

  const { score, level, gainStream, addLines } = useScoreTracker();

  const ghost = projectGhost(board);

  const hasHardDroppedRef = React.useRef(false);

  const [triggerLock, cancelLock, locked] = useLockDelay(() => {
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
    addLines(completedLines);
  }, [board]);

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
    action:
      | 'shiftL'
      | 'shiftR'
      | 'shiftF'
      | 'shiftB'
      | 'rotateL'
      | 'rotateR'
      | 'dropH',
  ) {
    if (hasHardDroppedRef.current || locked) {
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
      .with('dropH', () => {
        hardDrop(board);
        return true;
      })
      .exhaustive();
    if (success) {
      hasHardDroppedRef.current = action === 'dropH';
      const fx = match(action)
        .with('shiftL', () => FX.tetrimino_move)
        .with('shiftR', () => FX.tetrimino_move)
        .with('shiftF', () => FX.tetrimino_move)
        .with('shiftB', () => FX.tetrimino_move)
        .with('rotateL', () => FX.tetrimino_rotate)
        .with('rotateR', () => FX.tetrimino_rotate)
        .with('dropH', () => FX.hard_drop)
        .exhaustive();
      play(fx, 0.15);
    }
  }

  useKeyboardManager((event, button) =>
    match([event, button])
      .with(['press', 'KeyA'], () => gameAction('shiftL'))
      .with(['press', 'KeyD'], () => gameAction('shiftR'))
      .with(['press', 'KeyS'], () => gameAction('shiftB'))
      .with(['press', 'KeyW'], () => gameAction('shiftF'))
      .with(['press', 'KeyQ'], () => gameAction('rotateL'))
      .with(['press', 'KeyE'], () => gameAction('rotateR'))
      .with(['press', 'Space'], () => gameAction('dropH'))
      .with(['press', 'KeyX'], () => !locked && bag.switchHold?.())
      .with(['press', 'ArrowLeft'], () => cameraAction('left'))
      .with(['press', 'ArrowRight'], () => cameraAction('right'))
      .with(['press', 'KeyZ'], () => cutterAction('cut', 'left'))
      .with(['release', 'KeyZ'], () => cutterAction('uncut', 'left'))
      .with(['press', 'KeyC'], () => cutterAction('cut', 'right'))
      .with(['release', 'KeyC'], () => cutterAction('uncut', 'right'))
      .otherwise(() => null),
  );

  useGamepadManager((event, button) =>
    match([event, button])
      .with(['press', 'padL'], () => gameAction('shiftL'))
      .with(['press', 'padR'], () => gameAction('shiftR'))
      .with(['press', 'padU'], () => gameAction('shiftF'))
      .with(['press', 'padD'], () => gameAction('shiftB'))
      .with(['press', 'X'], () => gameAction('rotateL'))
      .with(['press', 'B'], () => gameAction('rotateR'))
      .with(['press', 'A'], () => gameAction('dropH'))
      .with(['press', 'Y'], () => !locked && bag.switchHold?.())
      .with(['press', 'LT'], () => cameraAction('left'))
      .with(['press', 'RT'], () => cameraAction('right'))
      .with(['press', 'LB'], () => cutterAction('cut', 'left'))
      .with(['release', 'LB'], () => cutterAction('uncut', 'left'))
      .with(['press', 'RB'], () => cutterAction('cut', 'right'))
      .with(['release', 'RB'], () => cutterAction('uncut', 'right'))
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
      <Tetrimino type={bag.current} occupiedBlocks={tetrimino} />
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
