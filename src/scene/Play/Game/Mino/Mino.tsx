import * as THREE from 'three';
import React from 'react';
import { match } from 'ts-pattern';
import { TriMaterial } from '~/materials/types';
import { minoMaterials } from '~/materials';
import { Tetrimino } from '~/tetrimino';
import { MINO_SIZE, Voxel, useInterpolatedValue } from '../../../shared';

type Props = {
  position: [number, number, number];
  type: Tetrimino;
  hideFace?: React.ComponentProps<typeof Voxel>['hideFace'];
  shrink?: number;
} & (
  | { status: 'normal' | 'disabled' | 'deleting' | 'ghost' }
  | { status: 'locking'; lockProgress: number }
);

export default function Mino(props: Props) {
  const interpolatedShrink = useInterpolatedValue(props.shrink ?? 0, 30);

  const material = match(props)
    .with(
      { status: 'locking' },
      ({ lockProgress }) =>
        minoMaterials[props.type]['normal'].map(
          lerpTowardWhite(lockProgress),
        ) as TriMaterial,
    )
    .otherwise(({ status }) => minoMaterials[props.type][status]);

  const size = MINO_SIZE * (1 - interpolatedShrink);

  return (
    <Voxel
      size={size}
      position={props.position}
      material={material}
      hideFace={props.hideFace}
    />
  );
}

const lerpTowardWhite =
  (alpha: number) => (material: THREE.MeshBasicMaterialParameters) => {
    const originalColor = new THREE.Color(material.color);
    const alteredColor = originalColor.lerp(new THREE.Color(1, 1, 1), alpha);
    return { ...material, color: alteredColor };
  };
