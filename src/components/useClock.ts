import * as React from 'react';

/** @see https://harddrop.com/wiki/Tetris_Worlds */
const gravity = [
  0, 0.01667, 0.021017, 0.026977, 0.035256, 0.04693, 0.06361, 0.0879, 0.1236,
  0.1775, 0.2598, 0.388, 0.59, 0.92, 1.46, 2.36,
];

function useLockDelayManagement(loopCallback: () => void) {
  // the number of moves that reset the timer during lock delay
  const lockDelayResetCounterRef = React.useRef(0);

  // a stable and updated reference to the loop callback, with the side effect of resetting the reset counter
  const counterResettingCallbackRef = React.useRef(() => {
    lockDelayResetCounterRef.current = 0;
    loopCallback();
  });
  React.useEffect(() => {
    counterResettingCallbackRef.current = loopCallback;
  }, [loopCallback]);

  // a stable function to execute the loop callback
  const execCounterResettingCallback = () => {
    counterResettingCallbackRef.current();
  };

  return [lockDelayResetCounterRef, execCounterResettingCallback] as const;
}

export default function useClock(callback: () => void) {
  const intervalRef = React.useRef<NodeJS.Timeout | undefined>(undefined);
  const levelRef = React.useRef(1);
  const [isRunning, setIsRunning] = React.useState(true);

  const speed = () => 1000 / (gravity[levelRef.current] * 60);

  const clear = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = undefined;
    }
  };

  const [resetCounterRef, execLoop] = useLockDelayManagement(callback);

  const toggle = () => {
    if (intervalRef.current) {
      clear();
    } else {
      intervalRef.current = setInterval(execLoop, speed());
    }
    setIsRunning((t) => !t);
  };

  // Start the clock when the component mounts, and clear it when unmounting
  React.useEffect(() => {
    intervalRef.current = setInterval(execLoop, speed());
    return () => {
      clear();
    };
  }, [execLoop]);

  return {
    isRunning,
    toggle,
  };
}
