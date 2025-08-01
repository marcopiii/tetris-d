import { match, P } from 'ts-pattern';
import { MINO_SIZE } from '../params';
import { minoMaterials, TriMaterial } from '../scene/assets/r3fMaterials';
import { Name as TetriminoType } from '../tetrimino';
import Voxel from './Voxel';

type Props = {
  position: [number, number, number];
  type: TetriminoType;
} & (
  | { disabled?: false; deleting: true }
  | { disabled: true; deleting?: false }
  | { disabled?: false; deleting?: false }
);

export default function Mino(props: Props) {
  const minoState = match(props)
    .with({ disabled: true }, () => 'disabled' as const)
    .with({ deleting: true }, () => 'deleting' as const)
    .otherwise(() => 'normal' as const);

  const material = minoMaterials[props.type][minoState];

  return (
    <Voxel size={MINO_SIZE} position={props.position} material={material} />
  );
}
