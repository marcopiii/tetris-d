import * as React from 'react';
import { match } from 'ts-pattern';

export default function useCutter(camera: string) {
  const [cut, setCut] = React.useState({ below: false, above: false });

  const applyCut = (apply: 'apply' | 'remove', side: 'below' | 'above') => {
    setCut((prev) =>
      match([apply, side])
        .with(['apply', 'below'], () => ({ ...prev, below: true }))
        .with(['remove', 'below'], () => ({ ...prev, below: false }))
        .with(['apply', 'above'], () => ({ ...prev, above: true }))
        .with(['remove', 'above'], () => ({ ...prev, above: false }))
        .otherwise(() => prev),
    );
  };

  React.useEffect(() => {
    setCut({ below: false, above: false });
  }, [camera]);

  return [cut, applyCut] as const;
}
