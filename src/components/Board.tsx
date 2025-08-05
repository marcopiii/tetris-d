import React from 'react';
import * as THREE from 'three';
import { match, P } from 'ts-pattern';
import { COLS, MINO_SIZE, ROWS } from '../params';
import { cuttingShadowMaterial } from '../scene/assets/r3fMaterials';
import { checkCompletedLines } from './boardAlgorithms';
import { PlaneCoords } from './Coords';
import Mino from './Mino';
import type { Name as TetriminoType } from '../tetrimino/types';

type Props = {
  occupiedBlocks: { type: TetriminoType; y: number; x: number; z: number }[];
  cutting: {
    plane: PlaneCoords;
    below: boolean;
    above: boolean;
  };
};

const offset = new THREE.Vector3(1 / 2, -1 / 2, 1 / 2);

// translations from the board coord system to the scene coord system
const translateX = (x: number) => x + offset.x - COLS / 2;
const translateY = (y: number) => -y + offset.y + ROWS / 2;
const translateZ = (z: number) => z + offset.z - COLS / 2;

const translate = (
  x: number,
  y: number,
  z: number,
): [number, number, number] => [translateX(x), translateY(y), translateZ(z)];

export default function Board(props: Props) {
  const completedLines = checkCompletedLines(props.occupiedBlocks);

  const visibleBlocks = props.occupiedBlocks.filter((block) =>
    match(props.cutting.plane)
      .with(
        { x: P.number },
        (plane) =>
          (!props.cutting.below || block.x >= plane.x) &&
          (!props.cutting.above || block.x <= plane.x),
      )
      .with(
        { z: P.number },
        (plane) =>
          (!props.cutting.below || block.z >= plane.z) &&
          (!props.cutting.above || block.z <= plane.z),
      )
      .exhaustive(),
  );

  return (
    <group>
      {visibleBlocks.map(({ type, y, x, z }) => {
        const position = translate(x, y, z);
        const deleting = completedLines.some((line) =>
          match(line)
            .with(
              { y: P.number, x: P.number },
              (line) => line.y === y && line.x === x,
            )
            .with(
              { y: P.number, z: P.number },
              (line) => line.y === y && line.z === z,
            )
            .exhaustive(),
        );
        return (
          <Mino
            key={`${y}.${x}.${z}`}
            type={type}
            position={position}
            status={deleting ? 'deleting' : 'normal'}
          />
        );
      })}
      <CuttingShadow {...props.cutting} />
    </group>
  );
}

function CuttingShadow(props: Props['cutting']) {
  const belowPosition = match(props.plane)
    .with({ x: P.number }, ({ x }) => [(x - COLS) / 2, 0, 0] as const)
    .with({ z: P.number }, ({ z }) => [0, (z - COLS) / 2, 0] as const)
    .exhaustive();
  const belowGeometry = match(props.plane)
    .with(
      { x: P.number },
      ({ x }) => [x * MINO_SIZE, COLS * MINO_SIZE] as const,
    )
    .with(
      { z: P.number },
      ({ z }) => [COLS * MINO_SIZE, z * MINO_SIZE] as const,
    )
    .exhaustive();
  const abovePosition = match(props.plane)
    .with({ x: P.number }, ({ x }) => [(x + 1) / 2, 0, 0] as const)
    .with({ z: P.number }, ({ z }) => [0, (z + 1) / 2, 0] as const)
    .exhaustive();
  const aboveGeometry = match(props.plane)
    .with(
      { x: P.number },
      ({ x }) => [(COLS - 1 - x) * MINO_SIZE, COLS * MINO_SIZE] as const,
    )
    .with(
      { z: P.number },
      ({ z }) => [COLS * MINO_SIZE, (COLS - 1 - z) * MINO_SIZE] as const,
    )
    .exhaustive();

  return (
    <group position={[0, -ROWS / 2, 0]} rotation={[Math.PI / 2, 0, 0]}>
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
