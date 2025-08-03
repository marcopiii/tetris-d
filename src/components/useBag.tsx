import React from 'react';
import { Name as Tetrimino, tetriminos } from '../tetrimino';

// https://tetris.fandom.com/wiki/Random_Generator
function regenBag() {
  const bag = Object.keys(tetriminos) as Tetrimino[];
  for (let i = bag.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [bag[i], bag[j]] = [bag[j], bag[i]];
  }
  return bag;
}

export default function useBag() {
  const [bag, setBag] = React.useState<Tetrimino[]>(regenBag());
  const [hold, setHold] = React.useState<Tetrimino>();
  const [isHoldable, setHoldable] = React.useState(true);

  const pullNext = React.useCallback(() => {
    const [_, ...rest] = bag.length > 2 ? bag : [...bag, ...regenBag()];
    setBag(rest);
    setHoldable(true);
  }, [bag]);

  const [current, next] = React.useMemo(() => {
    const [current, next, ...rest] = bag;
    return [current, next] as const;
  }, [bag]);

  const switchHold = React.useCallback(() => {
    if (hold) {
      const [current, ...rest] = bag;
      setHold(current);
      setBag([hold, ...rest]);
    } else {
      setHold(current);
      pullNext();
    }
    setHoldable(false);
  }, [current, bag, hold, pullNext]);

  return {
    current,
    next,
    hold,
    pullNext,
    switchHold: isHoldable ? switchHold : undefined,
  };
}
