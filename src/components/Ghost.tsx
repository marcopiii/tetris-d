import * as THREE from 'three';
import { match } from 'ts-pattern';
import Mino from './Mino';
import { Name as TetriminoType } from '../tetrimino/types';
import { translate } from './translations';

type Props = {
  type: TetriminoType;
  occupiedBlocks: THREE.Vector3Like[];
};

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
