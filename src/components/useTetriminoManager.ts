import React from 'react';
import { COLS } from '../params';
import { tetrimino } from '../tetrimino';
import {
  Name as TetriminoType,
  RotationState,
  Shape,
} from '../tetrimino/types';

type Plane = 'x' | 'z';

function initPosition(plane: Plane, shape: Shape) {
  return plane === 'x'
    ? {
        x: Math.floor((COLS - 1) / 2),
        z: Math.ceil((COLS - 1 - shape.length) / 2),
        y: 0,
      }
    : {
        x: Math.ceil((COLS - 1 - shape.length) / 2),
        z: Math.floor((COLS - 1) / 2),
        y: 0,
      };
}

export default function useTetriminoManager(
  tetriminoType: TetriminoType,
  plane: 'x' | 'z',
) {
  const initShape = tetrimino[tetriminoType];

  const [rotationState, setRotationState] = React.useState<RotationState>('0');
  const [position, setPosition] = React.useState(
    initPosition(plane, initShape),
  );
  const [shape, setShape] = React.useState<Shape>(initShape);

  const flatMapBlocks = React.useCallback(
    <T>(callback: (y: number, x: number, z: number) => T): T[] =>
      shape
        .flatMap((layer, dy) =>
          layer.flatMap((exists, k) => {
            if (!exists) return undefined;
            const dx = plane === 'x' ? 0 : k;
            const dz = plane === 'z' ? 0 : k;
            return callback(position.y + dy, position.x + dx, position.z + dz);
          }),
        )
        .filter((b): b is T => !!b),
    [shape, position, plane],
  );

  return { flatMapBlocks };
}
