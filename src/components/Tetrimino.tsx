import * as THREE from 'three';
import { COLS, ROWS } from '../params';
import { Piece } from '../scenario/game/Piece';
import Mino from './Mino';

type Props = {
  tetrimino: Piece;
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

export default function Tetrimino(props: Props) {
  return (
    <group>
      {props.tetrimino.flatMapBlocks((y, x, z) => (
        <Mino type={props.tetrimino.type} position={translate(x, y, z)} />
      ))}
    </group>
  );
}
