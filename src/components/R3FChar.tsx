import { VOXEL_SIZE } from '../params';
import { voxelMaterials } from '../scene/assets/r3fMaterials';
import { Char } from '../scene/font';
import Voxel from './Voxel';

type Props = {
  position: [number, number, number];
  char: Char;
  type: 'main' | 'primary' | 'secondary';
};

export default function R3FChar(props: Props) {
  const size = VOXEL_SIZE[props.type];
  const material = voxelMaterials[props.type];

  return (
    <group position={props.position}>
      {props.char.map((row, y) =>
        row.map((v, x) => {
          if (v) {
            const position: [number, number, number] = [x * size, -y * size, 0];
            return (
              <Voxel position={position} size={size} material={material} />
            );
          }
        }),
      )}
    </group>
  );
}
