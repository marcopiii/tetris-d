import { ComponentProps } from 'react';
import { MINO_SIZE } from '../params';
import { minoMaterials } from '../scene/assets/r3fMaterials';
import { Name as TetriminoType } from '../tetrimino';
import Voxel from './Voxel';

type Props = {
  position: [number, number, number];
  type: TetriminoType;
  status: 'normal' | 'disabled' | 'deleting' | 'ghost';
  hideFace?: ComponentProps<typeof Voxel>['hideFace'];
};

export default function Mino(props: Props) {
  const material = minoMaterials[props.type][props.status];

  return (
    <Voxel
      size={MINO_SIZE}
      position={props.position}
      material={material}
      hideFace={props.hideFace}
    />
  );
}
