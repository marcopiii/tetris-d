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

  const isVisible = (block: MinoCoord) =>
    match(props.cutting.plane)
      .with(
        { x: P.number },
        (plane) =>
          (!props.cutting.below || block.x >= plane.x) &&
          (!props.cutting.above || block.x <= plane.x),
      )
      .with(
        { z: P.number },
        (plane) =>
          (!props.cutting.below || block.z >= plane.z) &&
          (!props.cutting.above || block.z <= plane.z),
      )
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
            isHidden={!isVisible({ y, x, z })}
          />
        );
      })}
      <CuttingShadow {...props.cutting} />
    </group>
  );
}
