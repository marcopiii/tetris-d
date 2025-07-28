import { MINO_SIZE } from '../params';
import { minoMaterials, TriMaterial } from '../scene/assets/r3fMaterials';
import { Name } from '../tetrimino';
import Voxel from './Voxel';

type Props = {
  position: [number, number, number];
} & (
  | { type: Name; deleting?: never; disabled?: never }
  | { type?: never; deleting: true; disabled?: never }
  | { type?: never; deleting?: never; disabled: true }
);
export default function Mino(props: Props) {
  const material: TriMaterial = props.disabled
    ? minoMaterials.disabled
    : props.deleting
      ? [minoMaterials.deleting, minoMaterials.deleting, minoMaterials.deleting]
      : minoMaterials.normal[props.type];

  return (
    <Voxel size={MINO_SIZE} position={props.position} material={material} />
  );
}
