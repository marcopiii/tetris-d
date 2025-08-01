import * as THREE from 'three';
import { match, P } from 'ts-pattern';
import { COLS, ROWS } from '../params';
import { LineCoord } from '../scenario/game/types';
import { checkCompletedLines } from './boardAlgorithms';
import Mino from './Mino';
import type { Name as TetriminoType } from '../tetrimino/types';

type Props = {
  occupiedBlocks: { type: TetriminoType; y: number; x: number; z: number }[];
};

const offset = new THREE.Vector3(1 / 2, -1 / 2, 1 / 2);

// translations from the board coord system to the scene coord system
const translateX = (x: number) => x + offset.x - COLS / 2;
const translateY = (y: number) => -y + offset.y + ROWS / 2;
const translateZ = (z: number) => z + offset.z - COLS / 2;

const translate = (
  x: number,
  y: number,
  z: number,
): [number, number, number] => [translateX(x), translateY(y), translateZ(z)];

export default function Board(props: Props) {
  const completedLines = checkCompletedLines(props.occupiedBlocks);

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
            deleting={deleting}
            disabled={false}
          />
        );
      })}
    </group>
  );
}
