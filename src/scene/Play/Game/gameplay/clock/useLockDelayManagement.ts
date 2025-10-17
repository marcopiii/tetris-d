import * as React from 'react';

export default function useLockDelayManagement(loopCallback: () => void) {
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
