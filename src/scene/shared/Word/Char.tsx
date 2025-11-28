import * as Font from '~/font';
import { textMaterials } from '~/materials';
import { Text, textStyleConfig } from './textStyleConfig';
import Voxel from '../Voxel';

type Props = {
  position: [number, number, number];
  char: Font.Char;
  textStyle: Text;
  disabled?: boolean;
};

export default function Char(props: Props) {
  const size = textStyleConfig[props.textStyle].size;
  const material = props.disabled
    ? textMaterials.disabled
    : textMaterials[textStyleConfig[props.textStyle].color];

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
