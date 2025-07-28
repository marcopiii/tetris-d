import { MINO_SIZE } from '../params';
import { minoMaterials } from '../scene/assets/r3fMaterials';
import { Name as TetriminoType } from '../tetrimino/types';

type Props = {
  type: TetriminoType;
  position: [number, number, number];
  rotation: [number, number, number];
};

export function MinoShade(props: Props) {
  return (
    <mesh rotation={props.rotation} position={props.position}>
      <planeGeometry args={[MINO_SIZE, MINO_SIZE]} />
      <meshBasicMaterial {...minoMaterials.shade[props.type]} />
    </mesh>
  );
}
