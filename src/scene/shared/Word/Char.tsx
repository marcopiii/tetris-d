import { match } from 'ts-pattern';
import * as Font from '~/font';
import { textMaterials } from '~/materials';
import { VOXEL_SIZE } from '../params';
import Voxel from '../Voxel';

type Props = {
  position: [number, number, number];
  char: Font.Char;
  type: 'main' | 'primary' | 'primary-half' | 'secondary' | 'secondary-half';
  disabled?: boolean;
};

export default function Char(props: Props) {
  const size = match(props.type)
    .with('main', () => VOXEL_SIZE.main)
    .with('primary', () => VOXEL_SIZE.primary)
    .with('primary-half', () => VOXEL_SIZE['primary-half'])
    .with('secondary', () => VOXEL_SIZE.secondary)
    .with('secondary-half', () => VOXEL_SIZE.secondary)
    .exhaustive();

  const material = props.disabled
    ? textMaterials.disabled
    : match(props.type)
        .with('main', () => textMaterials.main)
        .with('primary', () => textMaterials.primary)
        .with('primary-half', () => textMaterials.primary)
        .with('secondary', () => textMaterials.secondary)
        .with('secondary-half', () => textMaterials.main)
        .exhaustive();

  return (
    <group position={props.position}>
      {props.char.map((row, y) =>
        row.map(
          (v, x) =>
            v && (
              <Voxel
                position={[x * size, -y * size, 0]}
                size={size}
                material={material}
                key={`${x}${y}`}
              />
            ),
        ),
      )}
    </group>
  );
}
