import React from 'react';

const LOCK_DELAY_MS = 500;
const MAX_LOCK_DELAY_RESETS = 15;

export default function useLockDelay(callback: () => void) {
  const timerId = React.useRef<number>(undefined);
  const resetCounterRef = React.useRef(0);

  const fn = () => {
    callback();
    timerId.current = undefined;
    resetCounterRef.current = 0;
  };

  const triggerLock = () => {
    if (timerId.current) {
      clearTimeout(timerId.current);
      resetCounterRef.current += 1;
    }
    timerId.current = window.setTimeout(fn, LOCK_DELAY_MS);
  };

  const cancelLock = () => {
    if (timerId.current) {
      clearTimeout(timerId.current);
      timerId.current = undefined;
      resetCounterRef.current = 0;
    }
  };

  const canReset = resetCounterRef.current >= MAX_LOCK_DELAY_RESETS;

  return [triggerLock, cancelLock, canReset] as const;
}
