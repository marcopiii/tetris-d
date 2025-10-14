import { useFrame } from '@react-three/fiber';
import React from 'react';
import { match, P } from 'ts-pattern';
import { COLS } from '../params';
import { LineCoord } from './Coords';
import R3FWord from './R3FWord';
import { translate } from './translations';
import useScoreTracker from './useScoreTracker';

type Props = {
  camera: 'c1' | 'c2' | 'c3' | 'c4';
  gain: NonNullable<ReturnType<typeof useScoreTracker>['gain']>;
};

export default function GainHighlighter(props: Props) {
  const sortedLines = props.gain.lines.toSorted((a, b) => b.y - a.y);

  const firstLine = sortedLines[0];
  if (!firstLine) return null;

  const [yOffset, setYOffset] = React.useState(0);
  const originalPointsPositioning = getPositioning(firstLine, props.camera);
  const currentPointsPositioning = {
    ...originalPointsPositioning,
    position: [
      originalPointsPositioning.position[0],
      originalPointsPositioning.position[1] + yOffset,
      originalPointsPositioning.position[2],
    ] as [number, number, number],
  };

  useFrame((_, delta) => {
    setYOffset((prev) => prev + 2 * delta);
  });

  return (
    <R3FWord
      position={currentPointsPositioning.position}
      rotation={currentPointsPositioning.rotation}
      alignX={currentPointsPositioning.alignment}
      text={`+${props.gain.points.toString()}`}
      type="secondary-half"
      font="numbers"
    />
  );
}

function getPositioning(line: LineCoord, camera: Props['camera']) {
  const [xAnchor, zAnchor] = match(camera)
    .with('c1', () => [-1, COLS])
    .with('c2', () => [COLS, COLS])
    .with('c3', () => [COLS, -1])
    .with('c4', () => [-1, -1])
    .exhaustive();

  const position = match(line)
    .with({ x: P.number }, ({ x, y }) => translate(x, y, zAnchor))
    .with({ z: P.number }, ({ z, y }) => translate(xAnchor, y, z))
    .exhaustive();

  const [yRotation, alignment] = match([line, camera])
    .with([{ x: P.number }, 'c1'], () => [-Math.PI / 2, 'right'] as const)
    .with([{ x: P.number }, 'c2'], () => [Math.PI / 2, 'left'] as const)
    .with([{ x: P.number }, 'c3'], () => [Math.PI / 2, 'right'] as const)
    .with([{ x: P.number }, 'c4'], () => [-Math.PI / 2, 'left'] as const)
    .with([{ z: P.number }, 'c1'], () => [0, 'left'] as const)
    .with([{ z: P.number }, 'c2'], () => [0, 'right'] as const)
    .with([{ z: P.number }, 'c3'], () => [Math.PI, 'left'] as const)
    .with([{ z: P.number }, 'c4'], () => [-Math.PI, 'right'] as const)
    .exhaustive();

  return {
    position,
    rotation: [0, yRotation, 0] as [number, number, number],
    alignment,
  };
}
