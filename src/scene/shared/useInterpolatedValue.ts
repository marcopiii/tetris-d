import React from 'react';
import { useFrame } from '@react-three/fiber';

export function useInterpolatedValue(targetValue: number, duration: number) {
  const [currentValue, setCurrentValue] = React.useState(targetValue);
  const v0 = React.useRef(targetValue);
  const t0 = React.useRef<number | null>(null);
  const isAnimatingRef = React.useRef(false);

  // If target changes, start a new animation
  React.useEffect(() => {
    if (targetValue === currentValue) {
      isAnimatingRef.current = false;
      return;
    }
    v0.current = currentValue;
    t0.current = null;
    isAnimatingRef.current = true;
  }, [targetValue, currentValue]);

  useFrame(({ clock }) => {
    if (!isAnimatingRef.current) return;

    const t = clock.getElapsedTime() * 1000;

    if (t0.current === null) {
      t0.current = t;
    }

    const elapsed = t - t0.current;
    const progress = Math.min(elapsed / duration, 1);

    const newValue = v0.current + (targetValue - v0.current) * progress;
    setCurrentValue(newValue);

    if (progress >= 1) {
      isAnimatingRef.current = false;
    }
  });

  return currentValue;
}
