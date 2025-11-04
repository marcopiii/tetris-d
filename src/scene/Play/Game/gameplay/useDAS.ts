import React from 'react';
import { Actions } from '../types';

type DASAction = Extract<Actions, 'shiftL' | 'shiftR' | 'shiftF' | 'shiftB'>;

export function useDAS() {
  const [das, setDas] = React.useState<DASAction>();

  const activateDAS = (action: DASAction) => {
    setDas(action);
  };

  const stopDAS = () => {
    setDas(undefined);
  };

  return { activateDAS, stopDAS };
}
