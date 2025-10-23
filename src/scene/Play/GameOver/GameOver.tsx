import { match } from 'ts-pattern';
import { useGamepadManager, useKeyboardManager } from '~/controls';
import { Scoreboard, useCamera, useLeaderboard } from '~/scene/shared';
import usePlayerHandler from './usePlayerHandler';

type Props = {
  onBack: () => void;
  result: {
    score: number;
    level: number;
  };
};

export default function GameOver(props: Props) {
  const [camera, setCamera] = useCamera({
    left: { position: [-10, 4, 10], lookAt: [0, 0, 0] },
    right: { position: [10, 4, 10], lookAt: [0, 0, 0] },
  });

  const cameraHandler = (command: 'moveL' | 'moveR'): void =>
    match([camera, command])
      .with(['right', 'moveL'], () => setCamera('left'))
      .with(['left', 'moveR'], () => setCamera('right'))
      .otherwise(() => {});

  const { handle, action: setHandle } = usePlayerHandler();

  const [leaderboard, saveNewRecord] = useLeaderboard();

  const newPos = match(
    leaderboard.findIndex((e) => props.result.score > e.score),
  )
    .with(-1, () => leaderboard.length)
    .otherwise((idx) => idx);

  const newRecord = {
    score: props.result.score,
    level: props.result.level,
    name: handle.join(''),
    rank: newPos + 1,
    editing: true,
  };

  const top8 = leaderboard.slice(0, 8);

  const entries = [
    ...top8.slice(0, newPos),
    newRecord,
    ...top8.slice(newPos, 8).map((e) => ({ ...e, rank: e.rank + 1 })),
  ];

  const onConfirm = () => {
    saveNewRecord(newRecord);
    props.onBack();
  };

  useKeyboardManager((event, button) =>
    match([event, button])
      .with(['press', 'ArrowLeft'], () => cameraHandler('moveL'))
      .with(['press', 'ArrowRight'], () => cameraHandler('moveR'))
      .with(['press', 'Escape'], () => props.onBack())
      // todo: handle name input when inserting
      .otherwise(() => {}),
  );

  useGamepadManager((event, button) =>
    match([event, button])
      .with(['press', 'LT'], () => cameraHandler('moveL'))
      .with(['press', 'RT'], () => cameraHandler('moveR'))
      .with(['press', 'padL'], () => setHandle.left())
      .with(['press', 'padR'], () => setHandle.right())
      .with(['press', 'padU'], () => setHandle.up())
      .with(['press', 'padD'], () => setHandle.down())
      .with(['press', 'A'], () => onConfirm())
      .with(['press', 'B'], () => props.onBack())

      // todo: handle name input when inserting
      .otherwise(() => {}),
  );

  return <Scoreboard title="Game Over" entries={entries} />;
}
