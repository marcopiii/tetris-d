import React from 'react';
import Menu from './components/Menu';
import { useMenuNavigation } from './components/utils.';

type Props = {
  onPvE: () => void;
  onControls: () => void;
  onAbout: () => void;
};

export function MainMenu(props: Props) {
  const menuItems = [
    { name: 'play', action: props.onPvE, terminal: true },
    { name: 'controls', action: props.onControls, terminal: true },
    { name: 'about', action: props.onAbout, terminal: true },
  ];

  const [options, navigate] = useMenuNavigation(menuItems);

  return <Menu title="tetris-d" options={options} />;
}
