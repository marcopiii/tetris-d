import React from 'react';
import { match } from 'ts-pattern';
import { clamp as _clamp } from '../utils';

export type MenuItem<T = never> = {
  name: string;
  accessory?: T;
  action: () => void;
  terminal?: boolean;
};

export type SelectableMenuItem<T = never> = MenuItem<T> & { selected: boolean };

const menuNavigationReducer =
  (itemsLength: number) => (selectedIndex: number, action: 'up' | 'down') => {
    const clamp = _clamp(0, itemsLength - 1);
    return match(action)
      .with('up', () => clamp(selectedIndex - 1))
      .with('down', () => clamp(selectedIndex + 1))
      .exhaustive();
  };

export function useMenuNavigation(
  items: MenuItem[],
): [SelectableMenuItem[], React.ActionDispatch<[action: 'up' | 'down']>] {
  const [selectedIndex, navigate] = React.useReducer(
    menuNavigationReducer(items.length),
    0,
  );
  const options = items.map((item, i) => ({
    ...item,
    selected: selectedIndex === i,
  }));
  return [options, navigate];
}
