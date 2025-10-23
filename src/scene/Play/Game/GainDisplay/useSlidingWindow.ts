import React from 'react';

const INTERVAL_MS = 100;

export default function useSlidingWindow(range: number) {
  const [k, next] = React.useReducer((v: number) => Math.min(v + 1, range), -1);

  React.useEffect(() => {
    const intervalId = setInterval(() => {
      next();
    }, INTERVAL_MS);
    return () => clearInterval(intervalId);
  }, [next]);

  return [k - 1, k, k + 1] as const;
}
