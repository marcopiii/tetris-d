import * as THREE from 'three';
import { match, P } from 'ts-pattern';
import { cuttingShadowMaterial } from '~/materials';
import { MINO_SIZE } from '~/scene/shared';
import { useGameParams } from '../params';
import { PlaneCoords } from '../types';

type Props = {
  plane: PlaneCoords;
  below: number;
  above: number;
};

export default function CuttingShadow(props: Props) {
  const { cols, rows } = useGameParams();

  const belowPosition = match(props.plane)
    .with({ x: P.number }, ({ x }) => [(x - cols) / 2, 0, 0] as const)
    .with({ z: P.number }, ({ z }) => [0, (z - cols) / 2, 0] as const)
    .exhaustive();
  const belowGeometry = match(props.plane)
    .with(
      { x: P.number },
      ({ x }) => [x * MINO_SIZE, cols * MINO_SIZE] as const,
    )
    .with(
      { z: P.number },
      ({ z }) => [cols * MINO_SIZE, z * MINO_SIZE] as const,
    )
    .exhaustive();
  const abovePosition = match(props.plane)
    .with({ x: P.number }, ({ x }) => [(x + 1) / 2, 0, 0] as const)
    .with({ z: P.number }, ({ z }) => [0, (z + 1) / 2, 0] as const)
    .exhaustive();
  const aboveGeometry = match(props.plane)
    .with(
      { x: P.number },
      ({ x }) => [(cols - 1 - x) * MINO_SIZE, cols * MINO_SIZE] as const,
    )
    .with(
      { z: P.number },
      ({ z }) => [cols * MINO_SIZE, (cols - 1 - z) * MINO_SIZE] as const,
    )
    .exhaustive();

  return (
    <group position={[0, -rows / 2, 0]} rotation={[Math.PI / 2, 0, 0]}>
      {props.below && (
        <mesh position={belowPosition}>
          <planeGeometry args={belowGeometry} />
          <meshBasicMaterial {...cuttingShadowMaterial} side={THREE.BackSide} />
        </mesh>
      )}
      {props.above && (
        <mesh position={abovePosition}>
          <planeGeometry args={aboveGeometry} />
          <meshBasicMaterial {...cuttingShadowMaterial} side={THREE.BackSide} />
        </mesh>
      )}
    </group>
  );
}
