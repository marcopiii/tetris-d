import * as React from 'react';
import { match } from 'ts-pattern';
import { AbsoluteCut, RelativeCut, RelativeSide } from './types';
import { Plane } from '../../types';
import { RelativeAxes } from '~/scene/shared/camera';

export default function useCutter(plane: Plane, relativeAxes: RelativeAxes) {
  const [relativeCut, setRelativeCut] = React.useState<RelativeCut>({
    left: 0,
    right: 0,
  });

  const applyRelativeCut = (side: RelativeSide, value: number) => {
    setRelativeCut((prev) => ({ ...prev, [side]: value }));
  };

  const fwRx = match(plane)
    .with('x', () => relativeAxes.x.forwardRight)
    .with('z', () => relativeAxes.z.forwardRight)
    .exhaustive();

  const absolutCut: AbsoluteCut = {
    below: fwRx ? relativeCut.left : relativeCut.right,
    above: fwRx ? relativeCut.right : relativeCut.left,
  };

  return [absolutCut, applyRelativeCut] as const;
}
