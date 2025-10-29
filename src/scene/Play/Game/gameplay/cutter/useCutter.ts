import * as React from 'react';
import { match } from 'ts-pattern';
import { AbsoluteCut, RelativeCut, RelativeSide } from './types';
import { Plane } from '../../types';
import { RelativeAxes } from '~/scene/shared/camera';

export default function useCutter(plane: Plane, relativeAxes: RelativeAxes) {
  const [relativeCut, setRelativeCut] = React.useState<RelativeCut>({
    left: false,
    right: false,
  });

  const toggleRelativeCut = (
    toggle: 'apply' | 'remove',
    side: RelativeSide,
  ) => {
    setRelativeCut((prev) => ({ ...prev, [side]: toggle === 'apply' }));
  };

  const fwRx = match(plane)
    .with('x', () => relativeAxes.x.forwardRight)
    .with('z', () => relativeAxes.z.forwardRight)
    .exhaustive();

  const absolutCut: AbsoluteCut = {
    below: fwRx ? relativeCut.left : relativeCut.right,
    above: fwRx ? relativeCut.right : relativeCut.left,
  };

  return [absolutCut, toggleRelativeCut] as const;
}
