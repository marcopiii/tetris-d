import React from 'react';

const LOCK_DELAY_MS = 500;
const MAX_LOCK_DELAY_RESETS = 15;

export default function useLockDelay(callback: () => void) {
  const [timerId, setTimerId] = React.useState<NodeJS.Timeout>();
  const [resetCounter, setResetCounter] = React.useState(0);

  const fn = () => {
    callback();
    setTimerId(undefined);
    setResetCounter(0);
  };

  const triggerLock = () => {
    if (timerId) {
      clearTimeout(timerId);
      setResetCounter((count) => count + 1);
    }
    const newTimerId = setTimeout(fn, LOCK_DELAY_MS);
    setTimerId(newTimerId);
  };

  const cancelLock = () => {
    if (timerId) {
      clearTimeout(timerId);
      setTimerId(undefined);
      setResetCounter(0);
    }
  };

  const locked = resetCounter >= MAX_LOCK_DELAY_RESETS;

  return [triggerLock, cancelLock, locked] as const;
}
