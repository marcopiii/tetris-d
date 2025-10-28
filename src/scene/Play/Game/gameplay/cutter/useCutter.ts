import * as React from 'react';
import { match } from 'ts-pattern';
import { AbsoluteSide, RelativeSide } from './types';
import { Plane } from '../../types';
import { RelativeAxes } from '~/scene/shared/camera';

type CutState = {
  absolute: Record<AbsoluteSide, boolean>;
  relative: Record<RelativeSide, boolean>;
};

export default function useCutter(plane: Plane, relativeAxes: RelativeAxes) {
  const [cut, setCut] = React.useState<CutState>({
    absolute: {
      below: false,
      above: false,
    },
    relative: {
      left: false,
      right: false,
    },
  });

  const fwRx = match(plane)
    .with('x', () => relativeAxes.x.forwardRight)
    .with('z', () => relativeAxes.z.forwardRight)
    .exhaustive();

  const relativeToAbsolute = (
    relative: CutState['relative'],
  ): CutState['absolute'] => ({
    below: fwRx ? relative.left : relative.right,
    above: fwRx ? relative.right : relative.left,
  });

  const applyRelativeCut = (apply: 'apply' | 'remove', side: RelativeSide) => {
    setCut((prev) => {
      const relative = { ...prev.relative, [side]: apply === 'apply' };
      const absolute = relativeToAbsolute(relative);
      return { absolute, relative };
    });
  };

  React.useEffect(() => {
    setCut((prev) => {
      const absolute = relativeToAbsolute(prev.relative);
      return { absolute, relative: prev.relative };
    });
  }, [plane, relativeAxes]);

  return [cut.absolute, applyRelativeCut] as const;
}
