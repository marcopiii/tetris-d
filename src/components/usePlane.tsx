import React from 'react';

export default function usePlane() {
  const [plane, setPlane] = React.useState<'x' | 'z'>('z');

  const toggle = () => {
    setPlane((prev) => (prev === 'x' ? 'z' : 'x'));
  };

  return { current: plane, change: toggle } as const;
}
