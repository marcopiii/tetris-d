import React from 'react';
import { match } from 'ts-pattern';
import { useGamepadManager, useKeyboardManager } from '~/controls';
import { Scoreboard, useCamera, useLeaderboard } from '~/scene/shared';

type Props = { onBack: () => void };

export default function Leaderboard(props: Props) {
  const [camera, setCamera] = useCamera({
    left: { position: [-10, 4, 10], lookAt: [0, 0, 0] },
    right: { position: [10, 4, 10], lookAt: [0, 0, 0] },
  });

  const cameraHandler = (command: 'moveL' | 'moveR'): void =>
    match([camera, command])
      .with(['right', 'moveL'], () => setCamera('left'))
      .with(['left', 'moveR'], () => setCamera('right'))
      .otherwise(() => {});

  const leaderboard = useLeaderboard();
  const top9 = leaderboard.slice(0, 9);

  useKeyboardManager((event, button) =>
    match([event, button])
      .with(['press', 'ArrowLeft'], () => cameraHandler('moveL'))
      .with(['press', 'ArrowRight'], () => cameraHandler('moveR'))
      .with(['press', 'Escape'], () => props.onBack())
      .otherwise(() => {}),
  );

  useGamepadManager((event, button) =>
    match([event, button])
      .with(['press', 'LT'], () => cameraHandler('moveL'))
      .with(['press', 'RT'], () => cameraHandler('moveR'))
      .with(['press', 'B'], () => props.onBack())
      .otherwise(() => {}),
  );

  return <Scoreboard title="Leaderboard" entries={top9} />;
}
