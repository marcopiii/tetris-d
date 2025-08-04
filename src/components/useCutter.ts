import React from 'react';
import { match } from 'ts-pattern';

type CuttingState = {
  below: boolean;
  above: boolean;
};

export default function useCutter() {
  return React.useReducer(
    (
      state: CuttingState,
      args: {
        action: 'cut' | 'uncut';
        side: 'below' | 'above';
      },
    ) => {
      return match([args.action, args.side])
        .with(['cut', 'below'], () => ({ ...state, below: true }))
        .with(['uncut', 'below'], () => ({ ...state, below: false }))
        .with(['cut', 'above'], () => ({ ...state, above: true }))
        .with(['uncut', 'above'], () => ({ ...state, above: false }))
        .otherwise(() => state);
    },
    { below: false, above: false },
  );
}
