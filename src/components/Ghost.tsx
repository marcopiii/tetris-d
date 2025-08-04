import * as THREE from 'three';
import { COLS, ROWS } from '../params';
import Mino from './Mino';
import { Name as TetriminoType } from '../tetrimino/types';

type Props = {
  type: TetriminoType;
  occupiedBlocks: { y: number; x: number; z: number }[];
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

export default function Ghost(props: Props) {
  return (
    <group>
      {props.occupiedBlocks.map(({ y, x, z }) => (
        <Mino type={props.type} position={translate(x, y, z)} status="ghost" />
      ))}
    </group>
  );
}
