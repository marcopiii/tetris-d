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
  gain: ReturnType<typeof useScoreTracker>['gainStream'][0];
};

export default function GainHighlighter(props: Props) {
  const sortedLines = props.gain.lines.toSorted((a, b) => b.y - a.y);

  const firstLine = sortedLines[0];
  if (!firstLine) return null;

  const ls = sortedLines.map((line) => {
    return getPositioning(line, props.camera);
  });

  const [visible, next] = React.useReducer(
    (v: number) => Math.min(v + 1, ls.length - 1),
    0,
  );

  React.useEffect(() => {
    const intervalId = setInterval(() => {
      next();
    }, 150);
    return () => clearInterval(intervalId);
  }, [next]);

  return (
    <LineHighlighter
      position={ls[visible].position}
      rotation={ls[visible].rotation}
      alignX={ls[visible].alignment}
      i={visible + 1}
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

function LineHighlighter(props: {
  position: React.ComponentProps<typeof R3FWord>['position'];
  rotation: React.ComponentProps<typeof R3FWord>['rotation'];
  alignX: React.ComponentProps<typeof R3FWord>['alignX'];
  i: number;
}) {
  const [yOffset, setYOffset] = React.useState(0);

  useFrame((_, delta) => {
    setYOffset((prev) => prev + 2 * delta);
  });

  return (
    <R3FWord
      position={[
        props.position[0],
        props.position[1] + yOffset,
        props.position[2],
      ]}
      rotation={props.rotation}
      alignX={props.alignX}
      text={props.i.toString()}
      type="secondary-half"
      font="numbers"
    />
  );
}
