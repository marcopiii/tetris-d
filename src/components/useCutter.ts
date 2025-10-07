import * as React from 'react';
import { match } from 'ts-pattern';

export default function useCutter(camera: string) {
  const [cut, setCut] = React.useState({ below: false, above: false });

  const applyCut = (action: 'cut' | 'uncut', side: 'below' | 'above') => {
    setCut((prev) =>
      match([action, side])
        .with(['cut', 'below'], () => ({ ...prev, below: true }))
        .with(['uncut', 'below'], () => ({ ...prev, below: false }))
        .with(['cut', 'above'], () => ({ ...prev, above: true }))
        .with(['uncut', 'above'], () => ({ ...prev, above: false }))
        .otherwise(() => prev),
    );
  };

  React.useEffect(() => {
    setCut({ below: false, above: false });
  }, [camera]);

  return [cut, applyCut] as const;
}
