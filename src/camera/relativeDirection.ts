import {Position, RelativeDirection} from './types';

export const relativeDirection: Record<Position, RelativeDirection> = {
  xR_zR: {
    x: 'positive',
    z: 'positive',
  },
  xR_zL: {
    x: 'positive',
    z: 'negative',
  },
  xL_zL: {
    x: 'negative',
    z: 'negative',
  },
  xL_zR: {
    x: 'negative',
    z: 'positive',
  }
};
