import React from 'react';
import { Actions } from '../types';
import { FPS } from './params';

type DASAction = Extract<Actions, 'shiftL' | 'shiftR' | 'shiftF' | 'shiftB'>;

type DASHandlers = Record<DASAction, () => void>;

/** Auto Repeat Rate */
const ARR_FRAMES = 2;

export function useDAS(handlers: DASHandlers) {
  const [dasAction, setDasAction] = React.useState<DASAction>();

  React.useEffect(() => {
    if (!dasAction) return;

    const interval = setInterval(
      () => {
        handlers[dasAction]();
      },
      ARR_FRAMES * (1000 / FPS),
    );

    return () => clearInterval(interval);
  }, [dasAction, handlers]);

  const activateDAS = (action: DASAction) => {
    setDasAction(action);
  };

  const stopDAS = () => {
    setDasAction(undefined);
  };

  return { activateDAS, stopDAS };
}
