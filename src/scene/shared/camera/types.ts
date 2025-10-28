import { Plane } from '~/scene/Play/Game/types';

export type RelativeAxes = Record<
  Plane,
  {
    rightInverted: boolean;
    forwardInverted: boolean;
    forwardRight: boolean;
  }
>;
