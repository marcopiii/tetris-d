import { useEffect } from 'react';
import * as React from 'react';

/** @see https://harddrop.com/wiki/Tetris_Worlds */
const gravity = [
  0, 0.01667, 0.021017, 0.026977, 0.035256, 0.04693, 0.06361, 0.0879, 0.1236,
  0.1775, 0.2598, 0.388, 0.59, 0.92, 1.46, 2.36,
];

export function useClock(callback: () => void) {
  const intervalRef = React.useRef<NodeJS.Timeout | undefined>(undefined);
  const levelRef = React.useRef(1);
  const resetCounterRef = React.useRef(0);

  const speed = React.useCallback(
    () => 100 / (gravity[levelRef.current] * 60),
    [],
  );

  const isRunning = intervalRef.current !== undefined;

  const wrappedCallback = React.useCallback(() => {
    resetCounterRef.current = 0;
    callback();
  }, [callback]);

  const clear = React.useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = undefined;
    }
  }, []);

  const toggle = React.useCallback(() => {
    if (intervalRef.current) {
      clear();
    } else {
      intervalRef.current = setInterval(wrappedCallback, speed());
    }
  }, [clear, wrappedCallback, speed]);

  const reset = React.useCallback(() => {
    if (resetCounterRef.current > 10) return;
    clear();
    intervalRef.current = setInterval(wrappedCallback, speed());
    resetCounterRef.current++;
  }, [clear, wrappedCallback, speed]);

  const start = React.useCallback(() => {
    clear();
    intervalRef.current = setInterval(wrappedCallback, speed());
  }, [clear, wrappedCallback, speed]);

  const setLevel = React.useCallback(
    (lvl: number) => {
      levelRef.current = lvl;
      clear();
      intervalRef.current = setInterval(wrappedCallback, speed());
    },
    [clear, wrappedCallback, speed],
  );

  const setFastDrop = React.useCallback(
    (active: boolean) => {
      if (!isRunning) return;
      if (gravity[levelRef.current] > 1) return;
      clear();
      if (active) {
        intervalRef.current = setInterval(wrappedCallback, 1000 / 60);
      } else {
        intervalRef.current = setInterval(wrappedCallback, speed());
      }
    },
    [isRunning, clear, wrappedCallback, speed],
  );

  // Start the clock when the component mounts
  useEffect(() => {
    start();
    return () => {
      clear();
    };
  }, [start]);

  return {
    isRunning,
    toggle,
    reset,
    setLevel,
    setFastDrop,
  };
}
