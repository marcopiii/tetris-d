import React from 'react';
import { match, P } from 'ts-pattern';
import { MinoCoord } from '~/scene/Play/Game/types';
import Mino from '../Mino';
import { Tetrimino } from '~/tetrimino';
import { checkCompletedLines } from '../gameplay';
import { translate } from '../utils';
import CuttingShadow from './CuttingShadow';

type Props = {
  occupiedBlocks: { type: Tetrimino; y: number; x: number; z: number }[];
  cutting: React.ComponentProps<typeof CuttingShadow>;
};

export default function Board(props: Props) {
  const completedLines = checkCompletedLines(props.occupiedBlocks);

  const cuttingLevel = (block: MinoCoord) =>
    match(props.cutting.plane)
      .with({ x: P.number }, (plane) => {
        return match(block.x)
          .with(P.number.lt(plane.x), () => props.cutting.below)
          .with(P.number.gt(plane.x), () => props.cutting.above)
          .otherwise(() => 0);
      })
      .with({ z: P.number }, (plane) => {
        return match(block.z)
          .with(P.number.lt(plane.z), () => props.cutting.below)
          .with(P.number.gt(plane.z), () => props.cutting.above)
          .otherwise(() => 0);
      })
      .exhaustive();

  return (
    <group>
      {props.occupiedBlocks.map(({ type, y, x, z }) => {
        const position = translate(x, y, z);
        const deleting = completedLines.some((line) =>
          match(line)
            .with(
              { y: P.number, x: P.number },
              (line) => line.y === y && line.x === x,
            )
            .with(
              { y: P.number, z: P.number },
              (line) => line.y === y && line.z === z,
            )
            .exhaustive(),
        );

        return (
          <Mino
            key={`${y}.${x}.${z}`}
            type={type}
            position={position}
            status={deleting ? 'deleting' : 'normal'}
            shrink={cuttingLevel({ y, x, z })}
          />
        );
      })}
      <CuttingShadow {...props.cutting} />
    </group>
  );
}
