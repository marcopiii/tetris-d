import { match } from 'ts-pattern';
import { minoMaterials } from '~/materials';
import { MINO_SIZE } from '~/scene/shared';
import { Tetrimino } from '~/tetrimino';

type Props = {
  type: Tetrimino;
  position: [number, number, number];
  rotation: [number, number, number];
  status: 'normal' | 'disabled';
};

export default function MinoShade(props: Props) {
  const material = match(props.status)
    .with('normal', () => minoMaterials[props.type].shade)
    .with('disabled', () => minoMaterials[props.type].disabled[0])
    .exhaustive();

  return (
    <mesh rotation={props.rotation} position={props.position}>
      <planeGeometry args={[MINO_SIZE, MINO_SIZE]} />
      <meshBasicMaterial {...material} />
    </mesh>
  );
}
