import { ComponentProps } from 'react';
import { minoMaterials } from '../../../../materials';
import { Tetrimino } from '../../../../tetrimino';
import { MINO_SIZE, Voxel } from '../../../shared';

type Props = {
  position: [number, number, number];
  type: Tetrimino;
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
