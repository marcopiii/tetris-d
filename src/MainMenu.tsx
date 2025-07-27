import React, { useEffect } from 'react';
import { match } from 'ts-pattern';
import Menu from './components/Menu';
import { useKeyboardManager } from './components/useKeyboardManager';
import useSetCamera from './components/useSetCamera';
import { useMenuNavigation } from './components/utils.';

type Props = {
  onPvE: () => void;
  onControls: () => void;
  onAbout: () => void;
};

export function MainMenu(props: Props) {
  const setCamera = useSetCamera({
    left: { position: [-10, 4, 10], lookAt: [0, 0, 0] },
    right: { position: [10, 4, 10], lookAt: [0, 0, 0] },
  });

  useEffect(() => {
    setCamera('left');
  }, []);

  const menuItems = [
    { name: 'play', action: props.onPvE, terminal: true },
    { name: 'controls', action: props.onControls, terminal: true },
    { name: 'about', action: props.onAbout, terminal: true },
  ];

  const [options, selectedOption, navigate] = useMenuNavigation(menuItems);

  const menuCameraHandler = React.useCallback(
    (command: 'moveL' | 'moveR'): void =>
      match(command)
        .with('moveL', () => setCamera('left'))
        .with('moveR', () => setCamera('right'))
        .exhaustive(),
    [],
  );

  const menuNavigationHandler = React.useCallback(
    (command: 'up' | 'down' | 'confirm'): void =>
      match(command)
        .with('confirm', () => selectedOption.current.action())
        .with('up', () => navigate('up'))
        .with('down', () => navigate('down'))
        .exhaustive(),
    [navigate],
  );

  useKeyboardManager(
    React.useCallback(
      (event: string, button: string) =>
        match([event, button])
          .with(['press', 'ArrowUp'], () => menuNavigationHandler('up'))
          .with(['press', 'ArrowDown'], () => menuNavigationHandler('down'))
          .with(['press', 'Enter'], () => menuNavigationHandler('confirm'))
          .with(['press', 'ArrowLeft'], () => menuCameraHandler('moveL'))
          .with(['press', 'ArrowRight'], () => menuCameraHandler('moveR'))
          .otherwise(() => {}),
      [menuNavigationHandler, menuCameraHandler],
    ),
  );

  return <Menu position={[-5, 0, 0]} title="tetris-d" options={options} />;
}
