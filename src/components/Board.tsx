import * as THREE from 'three';
import { match, P } from 'ts-pattern';
import { COLS, MINO_SIZE, ROWS } from '../params';
import { Board as BoardMatrix } from '../scenario/game/Board';
import Mino from './Mino';

type Props = {
  board: BoardMatrix;
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
      {props.board.flatMapBlocks((type, y, x, z) => {
        const position = translate(x, y, z);
        return match(type)
          .with('DELETE', () => <Mino position={position} deleting />)
          .with(P._, (name) => <Mino position={position} type={name} />)
          .exhaustive();
      })}
    </group>
  );
}
