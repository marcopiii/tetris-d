import { JSX } from 'react';
import * as THREE from 'three';
import { match, P } from 'ts-pattern';
import { COLS, MINO_SIZE, ROWS } from '../params';
import Mino from './Mino';
import { BoardBlock, BoardMatrix } from './useBoardManager';

type Props = {
  matrixIterator: <T>(
    callback: (type: BoardBlock, y: number, x: number, z: number) => T,
  ) => T[];
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
  return (
    <group>
      {props.matrixIterator((type, y, x, z) => {
        const position = translate(x, y, z);
        return match(type)
          .with('DELETE', () => (
            <Mino key={`${y}.${x}.${z}`} position={position} deleting />
          ))
          .with(P._, (name) => <Mino position={position} type={name} />)
          .exhaustive();
      })}
    </group>
  );
}
