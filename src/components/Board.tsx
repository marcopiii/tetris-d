import * as THREE from 'three';
import { match, P } from 'ts-pattern';
import { COLS, ROWS } from '../params';
import Mino from './Mino';
import { BoardBlock } from './useBoardManager';

type Props = {
  occupiedBlocks: { type: BoardBlock; y: number; x: number; z: number }[];
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
      {props.occupiedBlocks.map(({ type, y, x, z }) => {
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
