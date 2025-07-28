import { JSX } from 'react';
import * as THREE from 'three';
import { match, P } from 'ts-pattern';
import { COLS, MINO_SIZE, ROWS } from '../params';
import Mino from './Mino';
import { BoardBlock, BoardMatrix } from './useBoardManager';

type Props = {
  boardMatrix: BoardMatrix;
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

function flatMapBlocks<T>(matrix: BoardMatrix) {
  return (callback: (type: BoardBlock, y: number, x: number, z: number) => T) =>
    matrix
      .flatMap((layer, y) =>
        layer.flatMap((xRow, x) =>
          xRow.flatMap((type, z) =>
            type ? callback(type, y, x, z) : undefined,
          ),
        ),
      )
      .filter((i): i is T => !!i);
}

export default function Board(props: Props) {
  const renderMino = flatMapBlocks<JSX.Element>(props.boardMatrix);
  return (
    <group>
      {renderMino((type, y, x, z) => {
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
