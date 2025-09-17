import { match } from 'ts-pattern';
import { VOXEL_SIZE } from '../params';
import { voxelMaterials } from '../scene/assets/r3fMaterials';
import { Char } from '../scene/font';
import Voxel from './Voxel';

type Props = {
  position: [number, number, number];
  char: Char;
  type: 'main' | 'primary' | 'primary-half' | 'secondary' | 'secondary-half';
  disabled?: boolean;
};

export default function R3FChar(props: Props) {
  const size = match(props.type)
    .with('main', () => VOXEL_SIZE.main)
    .with('primary', () => VOXEL_SIZE.primary)
    .with('primary-half', () => VOXEL_SIZE['primary-half'])
    .with('secondary', () => VOXEL_SIZE.secondary)
    .with('secondary-half', () => VOXEL_SIZE.secondary)
    .exhaustive();
  
  const material = props.disabled
    ? voxelMaterials.disabled
    : match(props.type)
        .with('main', () => voxelMaterials.main)
        .with('primary', () => voxelMaterials.primary)
        .with('primary-half', () => voxelMaterials.primary)
        .with('secondary', () => voxelMaterials.secondary)
        .with('secondary-half', () => voxelMaterials.main)
        .exhaustive();

  return (
    <group position={props.position}>
      {props.char.map((row, y) =>
        row.map((v, x) => {
          if (v) {
            const position: [number, number, number] = [x * size, -y * size, 0];
            return (
              <Voxel
                position={position}
                size={size}
                material={material}
                key={`${x}${y}`}
              />
            );
          }
        }),
      )}
    </group>
  );
}
