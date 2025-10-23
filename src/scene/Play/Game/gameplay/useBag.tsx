import React from 'react';
import { Tetrimino, tetriminos } from '~/tetrimino';

/**
 * @see https://tetris.fandom.com/wiki/Random_Generator
 */
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

  const pullNext = () => {
    const [_, ...rest] = bag.length > 2 ? bag : [...bag, ...regenBag()];
    setBag(rest);
    setHoldable(true);
  };

  const [current, next, ..._rest] = bag;

  const switchHold = () => {
    if (hold) {
      const [current, ...rest] = bag;
      setHold(current);
      setBag([hold, ...rest]);
    } else {
      setHold(current);
      pullNext();
    }
    setHoldable(false);
  };

  return {
    current,
    next,
    hold,
    pullNext,
    switchHold: isHoldable ? switchHold : undefined,
  };
}
