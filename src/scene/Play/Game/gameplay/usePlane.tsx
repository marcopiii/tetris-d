import React from 'react';
import { match } from 'ts-pattern';
import { Plane } from '../types';

export default function usePlane() {
  const [plane, setPlane] = React.useState<Plane>('z');

  const toggle = () => {
    setPlane((prev) =>
      match<Plane, Plane>(prev)
        .with('x', () => 'z')
        .with('z', () => 'x')
        .exhaustive(),
    );
  };

  return { current: plane, change: toggle } as const;
}
