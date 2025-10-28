import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import TWEEN, { Group as TWEENGroup } from '@tweenjs/tween.js';
import React from 'react';
import { match } from 'ts-pattern';
import { TriMaterial } from '~/materials/types';
import { minoMaterials } from '~/materials';
import { Tetrimino } from '~/tetrimino';
import { MINO_SIZE, Voxel } from '../../../shared';

type Props = {
  position: [number, number, number];
  type: Tetrimino;
  hideFace?: React.ComponentProps<typeof Voxel>['hideFace'];
} & (
  | { status: 'normal' | 'disabled' | 'deleting' | 'ghost' }
  | { status: 'locking'; lockProgress: number }
) &
  (
    | {
        isHidden: boolean;
        tweenGroupRef: React.RefObject<TWEENGroup>;
      }
    | {
        isHidden?: never;
      }
  );

export default function Mino(props: Props) {
  const [cuttingProgress, setCuttingProgress] = React.useState(0);

  useFrame(() => {
    if (props.isHidden !== undefined) {
      props.tweenGroupRef.current.update();
    }
  });

  React.useEffect(() => {
    if (props.isHidden === undefined) return;
    new TWEEN.Tween({ progress: cuttingProgress }, props.tweenGroupRef.current)
      .to({ progress: props.isHidden ? 1 : 0 }, 100)
      .easing(TWEEN.Easing.Linear.InOut)
      .onUpdate(({ progress }) => setCuttingProgress(progress))
      .start();
  }, [props.isHidden]);

  const material = match(props)
    .with(
      { status: 'locking' },
      ({ lockProgress }) =>
        minoMaterials[props.type]['normal'].map(
          lerpTowardWhite(lockProgress),
        ) as TriMaterial,
    )
    .otherwise(({ status }) => minoMaterials[props.type][status]);

  const size = MINO_SIZE * (1 - cuttingProgress);

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
