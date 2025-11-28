import React from 'react';
import { LOCK_DELAY_MS, MAX_LOCK_DELAY_RESETS } from './params';
import { LockTimer } from './types';

/**
 * Mange the lock delay mechanism.
 * @param callback The callback to execute when the lock delay expires
 */
export default function useLockDelay(callback: () => void) {
  const lockTimer = React.useRef<LockTimer>(undefined);
  const resetCounterRef = React.useRef(0);

  const fn = () => {
    callback();
    lockTimer.current = undefined;
    resetCounterRef.current = 0;
  };

  const triggerLock = () => {
    if (lockTimer.current) {
      clearTimeout(lockTimer.current.id);
      resetCounterRef.current += 1;
    }
    lockTimer.current = {
      id: window.setTimeout(fn, LOCK_DELAY_MS),
      t0: performance.now(),
    };
  };

  const cancelLock = () => {
    if (lockTimer.current) {
      clearTimeout(lockTimer.current.id);
      lockTimer.current = undefined;
      resetCounterRef.current = 0;
    }
  };

  const canReset = resetCounterRef.current < MAX_LOCK_DELAY_RESETS;

  return {
    triggerLock,
    cancelLock,
    canReset,
    lockTimer,
  } as const;
}
