import React from 'react';
import { match } from 'ts-pattern';
import Menu from './components/Menu';
import useGamepadManager from './components/useGamepadManager';
import { useKeyboardManager } from './components/useKeyboardManager';
import useCamera from './components/useCamera';
import { useMenuNavigation } from './components/utils.';

type Props = {
  onPlay: () => void;
  onControls: () => void;
  onLeaderboard: () => void;
};

export function MainMenu(props: Props) {
  const [camera, setCamera] = useCamera({
    left: { position: [-10, 4, 10], lookAt: [0, 0, 0] },
    right: { position: [10, 4, 10], lookAt: [0, 0, 0] },
  });

  const menuItems = [
    { name: 'play', action: props.onPlay, terminal: true },
    { name: 'controls', action: props.onControls, terminal: true },
    { name: 'leaderboard', action: props.onLeaderboard, terminal: true },
    {
      name: 'about',
      action: () => {
        window.location.href = 'https://github.com/marcopiii/tetris-d';
      },
      terminal: true,
    },
  ];

  const [options, selectedOption, navigate] = useMenuNavigation(menuItems);

  const menuCameraHandler = (command: 'moveL' | 'moveR'): void =>
    match([camera, command])
      .with(['right', 'moveL'], () => setCamera('left'))
      .with(['left', 'moveR'], () => setCamera('right'))
      .otherwise(() => {});

  const menuNavigationHandler = (command: 'up' | 'down' | 'confirm'): void =>
    match(command)
      .with('confirm', () => selectedOption.current.action())
      .with('up', () => navigate('up'))
      .with('down', () => navigate('down'))
      .exhaustive();

  useKeyboardManager((event, button) =>
    match([event, button])
      .with(['press', 'ArrowUp'], () => menuNavigationHandler('up'))
      .with(['press', 'ArrowDown'], () => menuNavigationHandler('down'))
      .with(['press', 'Enter'], () => menuNavigationHandler('confirm'))
      .with(['press', 'ArrowLeft'], () => menuCameraHandler('moveL'))
      .with(['press', 'ArrowRight'], () => menuCameraHandler('moveR'))
      .otherwise(() => {}),
  );

  useGamepadManager((event, button) =>
    match([event, button])
      .with(['press', 'padD'], () => menuNavigationHandler('down'))
      .with(['press', 'padU'], () => menuNavigationHandler('up'))
      .with(['press', 'A'], () => menuNavigationHandler('confirm'))
      .with(['press', 'LT'], () => menuCameraHandler('moveL'))
      .with(['press', 'RT'], () => menuCameraHandler('moveR'))
      .otherwise(() => {}),
  );

  return <Menu position={[0, 0, 0]} title="tetris-d" options={options} />;
}
