import * as React from 'react';

/** @see https://harddrop.com/wiki/Tetris_Worlds */
const gravity = [
  0, 0.01667, 0.021017, 0.026977, 0.035256, 0.04693, 0.06361, 0.0879, 0.1236,
  0.1775, 0.2598, 0.388, 0.59, 0.92, 1.46, 2.36,
];

const SOFT_DROP_G = 1 / 3;

export default function useGravity(
  callback: (isSoftDropping: boolean) => void,
  level: number,
) {
  const intervalRef = React.useRef<NodeJS.Timeout | undefined>(undefined);

  const [isSoftDropping, setSoftDropping] = React.useState(false);

  const appliedGravity = isSoftDropping
    ? Math.max(SOFT_DROP_G, gravity[level])
    : gravity[level];
  const rowsPerSecond = appliedGravity * 60;
  const speed = 1000 / rowsPerSecond;

  // todo: use `useEffectEvent`
  const callbackRef = React.useRef(callback);
  React.useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  React.useEffect(() => {
    intervalRef.current = setInterval(
      () => callbackRef.current(isSoftDropping),
      speed,
    );
    return () => clearInterval(intervalRef.current);
  }, [level, speed]);

  const pauseGravity = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = undefined;
    }
  };

  const resumeGravity = () => {
    if (!intervalRef.current) {
      intervalRef.current = setInterval(
        () => callbackRef.current(isSoftDropping),
        speed,
      );
    }
  };

  return { pauseGravity, resumeGravity, setSoftDropping } as const;
}
