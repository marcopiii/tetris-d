import React from 'react';
import { match } from 'ts-pattern';
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

  const [options, selectedOption, navigate] = useMenuNavigation(menuItems);

  const menuCommandHandler = (command: 'up' | 'down' | 'confirm'): void =>
    match(command)
      .with('confirm', () => selectedOption.action())
      .with('up', () => navigate('up'))
      .with('down', () => navigate('down'))
      .exhaustive();

  return <Menu title="tetris-d" options={options} />;
}
