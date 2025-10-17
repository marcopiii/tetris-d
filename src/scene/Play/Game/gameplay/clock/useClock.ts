import * as React from 'react';
import useLockDelayManagement from './useLockDelayManagement';

/** @see https://harddrop.com/wiki/Tetris_Worlds */
const gravity = [
  0, 0.01667, 0.021017, 0.026977, 0.035256, 0.04693, 0.06361, 0.0879, 0.1236,
  0.1775, 0.2598, 0.388, 0.59, 0.92, 1.46, 2.36,
];

// todo: use useEffectEvent instead of Ref
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

  // todo: expose and use resetCounterRef
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
    return clear;
  }, [execLoop]);

  return {
    isRunning,
    toggle,
  };
}
