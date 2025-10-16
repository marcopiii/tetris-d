import { useFrame } from '@react-three/fiber';
import React, { ComponentProps } from 'react';
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
  const primaryPlane =
    props.gain.lines.filter((l) => 'x' in l).length >
    props.gain.lines.filter((l) => 'z' in l).length
      ? 'z'
      : 'x';

  const lineOrderCriteria = (a: LineCoord, b: LineCoord) => {
    const yDiff = a.y - b.y;

    const xInverted = props.camera.relativeAxis.x.forwardInverted;
    const zInverted = props.camera.relativeAxis.z.forwardInverted;

    return match([a, b])
      .with([{ x: P.number }, { x: P.number }], ([a, b]) => {
        const xDiff = a.x - b.x;
        return (xInverted ? xDiff : -xDiff) || yDiff;
      })
      .with([{ z: P.number }, { z: P.number }], ([a, b]) => {
        const zDiff = a.z - b.z;
        return (zInverted ? zDiff : -zDiff) || yDiff;
      })
      .with([{ x: P.number }, { z: P.number }], () =>
        primaryPlane === 'x' ? 1 : -1,
      )
      .with([{ z: P.number }, { x: P.number }], () =>
        primaryPlane === 'x' ? -1 : 1,
      )
      .exhaustive();
  };

  const sortedLines = props.gain.lines.toSorted(lineOrderCriteria);

  const firstLine = sortedLines[0];
  const ls: Omit<
    ComponentProps<typeof LineHighlighter> & { id: string },
    'lineNumber'
  >[] = sortedLines.map((line) => {
    const id = [line.x ?? '_', line.y, line.z ?? '_'].join(':');
    const layout = getPositioning(line, props.camera);
    const kind = match([firstLine, line])
      .with([{ x: P.number }, { x: P.number }], ([first, thiz]) =>
        first.x !== thiz.x ? ('par' as const) : ('std' as const),
      )
      .with([{ z: P.number }, { z: P.number }], ([first, thiz]) =>
        first.z !== thiz.z ? ('par' as const) : ('std' as const),
      )
      .otherwise(() => 'ort' as const);
    return { id, kind, ...layout };
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
    (line, i) =>
      [k - 1, k, k + 1].includes(i) && (
        <LineHighlighter
          key={line.id}
          position={line.position}
          rotation={line.rotation}
          alignment={line.alignment}
          kind={line.kind}
          lineNumber={i + 1}
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
  position: NonNullable<React.ComponentProps<typeof R3FWord>['position']>;
  rotation: NonNullable<React.ComponentProps<typeof R3FWord>['rotation']>;
  alignment: NonNullable<React.ComponentProps<typeof R3FWord>['alignX']>;
  lineNumber: number;
  kind: 'std' | 'ort' | 'par';
}) {
  const [yOffset, setYOffset] = React.useState(0);

  useFrame((_, delta) => {
    setYOffset((prev) => prev + 1.5 * delta);
  });

  const text = [
    `+${props.lineNumber.toString()}`,
    `LINE${props.lineNumber > 1 ? 'S' : ''}`,
    ...match(props.kind)
      .with('par', () => ['PAR'])
      .with('ort', () => ['ORT'])
      .otherwise(() => []),
  ].join(' ');

  return (
    <R3FWord
      position={[
        props.position[0],
        props.position[1] + yOffset,
        props.position[2],
      ]}
      rotation={props.rotation}
      alignX={props.alignment}
      text={text}
      type="secondary-half"
      font="numbers"
    />
  );
}
