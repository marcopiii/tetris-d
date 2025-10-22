import { clamp as clampBetween } from 'es-toolkit';
import React from 'react';
import { match } from 'ts-pattern';
import type { MenuItem, SelectableMenuItem } from './types';

const menuNavigationReducer =
  (itemsLength: number) =>
  (selectedIndex: number, action: 'up' | 'down'): number => {
    const clamp = (n: number) => clampBetween(n, 0, itemsLength - 1);
    return match(action)
      .with('up', () => clamp(selectedIndex - 1))
      .with('down', () => clamp(selectedIndex + 1))
      .exhaustive();
  };

export default function useMenuNavigation(
  items: MenuItem[],
): [
  SelectableMenuItem[],
  React.RefObject<MenuItem>,
  React.ActionDispatch<['up' | 'down']>,
] {
  const [selectedIndex, navigate] = React.useReducer(
    menuNavigationReducer(items.length),
    0,
  );
  const options = items.map((item, i) => ({
    ...item,
    selected: selectedIndex === i,
  }));

  // selectedOption is a ref to provide a stable reference for event handlers
  // todo: use useEffectEvent instead
  const selectedOption = React.useRef(items[selectedIndex]);
  React.useEffect(() => {
    selectedOption.current = items[selectedIndex];
  }, [items[selectedIndex]]);

  return [options, selectedOption, navigate];
}
