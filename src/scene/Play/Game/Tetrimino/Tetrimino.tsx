import { COLS } from '~/scene/Play/Game/params';
import Mino from '../Mino';
import { translate } from '../utils';
import MinoShade from './MinoShade';
import { Tetrimino as TetriminoType } from '~/tetrimino';

type Props = {
  type: TetriminoType;
  occupiedBlocks: { y: number; x: number; z: number }[];
};

export default function Tetrimino(props: Props) {
  //todo(marco): change appearance of the blocks in the vanish zone

  return (
    <group>
      {props.occupiedBlocks.map(({ y, x, z }) => {
        const [tx, ty, tz] = translate(x, y, z);
        return (
          <>
            <Mino
              type={props.type}
              position={translate(x, y, z)}
              status="normal"
            />
            <MinoShade
              type={props.type}
              rotation={[0, 0, 0]}
              position={[tx, ty, -COLS / 2]}
            />
            <MinoShade
              type={props.type}
              rotation={[0, Math.PI / 2, 0]}
              position={[-COLS / 2, ty, tz]}
            />
            <MinoShade
              type={props.type}
              rotation={[0, Math.PI, 0]}
              position={[tx, ty, COLS / 2]}
            />
            <MinoShade
              type={props.type}
              rotation={[0, -Math.PI / 2, 0]}
              position={[COLS / 2, ty, tz]}
            />
          </>
        );
      })}
    </group>
  );
}
