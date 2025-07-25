import React from 'react';
import Menu from './components/Menu';

type Props = {
  onPvE: () => void;
  onControls: () => void;
  onAbout: () => void;
};

export function MainMenu(props: Props) {
  const options = [
    { name: 'play', action: props.onPvE, terminal: true },
    { name: 'controls', action: props.onControls, terminal: true },
    { name: 'about', action: props.onAbout, terminal: true },
  ];

  return <Menu title="tetris-d" options={options} />;
}
