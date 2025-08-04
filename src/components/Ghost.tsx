import * as THREE from 'three';
import { match } from 'ts-pattern';
import { COLS, ROWS } from '../params';
import Mino from './Mino';
import { Name as TetriminoType } from '../tetrimino/types';

type Props = {
  type: TetriminoType;
  occupiedBlocks: THREE.Vector3Like[];
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
  const checkSideOf =
    ({ x, y, z }: THREE.Vector3Like) =>
    (side: 'x+' | 'x-' | 'y+' | 'y-' | 'z+' | 'z-') => {
      return props.occupiedBlocks.some((b) =>
        match(side)
          .with('x+', () => b.x == x + 1 && b.y == y && b.z == z)
          .with('x-', () => b.x == x - 1 && b.y == y && b.z == z)
          .with('y+', () => b.x == x && b.y == y - 1 && b.z == z)
          .with('y-', () => b.x == x && b.y == y + 1 && b.z == z)
          .with('z+', () => b.x == x && b.y == y && b.z == z + 1)
          .with('z-', () => b.x == x && b.y == y && b.z == z - 1)
          .exhaustive(),
      );
    };

  return (
    <group>
      {props.occupiedBlocks.map(({ x, y, z }) => {
        const checkSide = checkSideOf({ x, y, z });
        const hideFaces = {
          'x+': checkSide('x+'),
          'x-': checkSide('x-'),
          'y+': checkSide('y+'),
          'y-': checkSide('y-'),
          'z+': checkSide('z+'),
          'z-': checkSide('z-'),
        };
        return (
          <Mino
            type={props.type}
            position={translate(x, y, z)}
            status="ghost"
            hideFace={hideFaces}
          />
        );
      })}
    </group>
  );
}
