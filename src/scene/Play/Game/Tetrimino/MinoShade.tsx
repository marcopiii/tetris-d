import { minoMaterials } from '~/materials';
import { MINO_SIZE } from '~/scene/shared';
import { Tetrimino } from '~/tetrimino';

type Props = {
  type: Tetrimino;
  position: [number, number, number];
  rotation: [number, number, number];
};

export default function MinoShade(props: Props) {
  return (
    <mesh rotation={props.rotation} position={props.position}>
      <planeGeometry args={[MINO_SIZE, MINO_SIZE]} />
      <meshBasicMaterial {...minoMaterials[props.type].shade} />
    </mesh>
  );
}
