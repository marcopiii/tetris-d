import { Position, RelativeDirection } from './types';

export const relativeDirection: Record<Position, RelativeDirection> = {
  c1: {
    x: 'positive',
    z: 'positive',
  },
  c2: {
    x: 'positive',
    z: 'negative',
  },
  c3: {
    x: 'negative',
    z: 'negative',
  },
  c4: {
    x: 'negative',
    z: 'positive',
  },
};
