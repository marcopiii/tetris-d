import * as React from 'react';

/** @see https://harddrop.com/wiki/Tetris_Worlds */
export const gravity = [
  0, 0.01667, 0.021017, 0.026977, 0.035256, 0.04693, 0.06361, 0.0879, 0.1236,
  0.1775, 0.2598, 0.388, 0.59, 0.92, 1.46, 2.36,
];

export default function useGravity(callback: () => void, level: number) {
  const intervalRef = React.useRef<NodeJS.Timeout | undefined>(undefined);

  // todo: use `useEffectEvent`
  const callbackRef = React.useRef(callback);
  React.useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const speed = 1000 / (gravity[level] * 60);

  React.useEffect(() => {
    intervalRef.current = setInterval(() => callbackRef.current(), speed);
    return () => clearInterval(intervalRef.current);
  }, [level]);
}
