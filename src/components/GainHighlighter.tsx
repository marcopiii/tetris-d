import { useFrame } from '@react-three/fiber';
import React from 'react';
import { match, P } from 'ts-pattern';
import { COLS } from '../params';
import { LineCoord } from '../scenario/game/types';
import R3FWord from './R3FWord';
import { translate } from './translations';
import useCamera from './useCamera';
import useScoreTracker from './useScoreTracker';

type Props = {
  camera: {
    position: 'c1' | 'c2' | 'c3' | 'c4';
    relativeAxis: ReturnType<typeof useCamera>[2];
  };
  gain: ReturnType<typeof useScoreTracker>['gainStream'][0];
};

export default function GainHighlighter(props: Props) {
  // order the lines based on camera position: farther lines first
  const lineOrderCriteria = (a: LineCoord, b: LineCoord) => {
    const yDiff = a.y - b.y;
    const xDiff = (a.x ?? 0) - (b.x ?? 0);
    const zDiff = (a.z ?? 0) - (b.z ?? 0);
    return match([
      props.camera.relativeAxis.x.forwardInverted,
      props.camera.relativeAxis.z.forwardInverted,
    ])
      .with([false, false], () => -xDiff || -zDiff || yDiff)
      .with([true, false], () => xDiff || -zDiff || yDiff)
      .with([true, true], () => xDiff || zDiff || yDiff)
      .with([false, true], () => -xDiff || zDiff || yDiff)
      .exhaustive();
  };

  const sortedLines = props.gain.lines.toSorted(lineOrderCriteria);

  const firstLine = sortedLines[0];
  if (!firstLine) return null;

  const ls = sortedLines.map((line) => {
    const id = [line.x ?? '_', line.y, line.z ?? '_'].join(':');
    const layout = getPositioning(line, props.camera);
    return { id, ...layout };
  });

  const [k, next] = React.useReducer(
    (v: number) => Math.min(v + 1, ls.length),
    -1,
  );

  React.useEffect(() => {
    const intervalId = setInterval(() => {
      next();
    }, 100);
    return () => clearInterval(intervalId);
  }, [next]);

  return ls.map(
    (l, i) =>
      [k - 1, k, k + 1].includes(i) && (
        <LineHighlighter
          key={l.id}
          position={l.position}
          rotation={l.rotation}
          align={l.alignment}
          n={i + 1}
        />
      ),
  );
}

function getPositioning(line: LineCoord, camera: Props['camera']) {
  const [xAnchor, zAnchor] = match(camera.position)
    .with('c1', () => [-1, COLS])
    .with('c2', () => [COLS, COLS])
    .with('c3', () => [COLS, -1])
    .with('c4', () => [-1, -1])
    .exhaustive();

  const position = match(line)
    .with({ x: P.number }, ({ x, y }) => translate(x, y, zAnchor))
    .with({ z: P.number }, ({ z, y }) => translate(xAnchor, y, z))
    .exhaustive();

  const [yRotation, alignment] = match([line, camera.position])
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
  rotation: NonNullable<React.ComponentProps<typeof R3FWord>['rotation']>;
  align: NonNullable<React.ComponentProps<typeof R3FWord>['alignX']>;
  n: number;
}) {
  const [yOffset, setYOffset] = React.useState(0);

  useFrame((_, delta) => {
    setYOffset((prev) => prev + 1.5 * delta);
  });

  const text = `+${props.n.toString()} LINE`;

  return (
    <R3FWord
      position={[
        props.position[0],
        props.position[1] + yOffset,
        props.position[2],
      ]}
      rotation={props.rotation}
      alignX={props.align}
      text={text}
      type="secondary-half"
      font="numbers"
    />
  );
}
