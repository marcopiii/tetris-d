import { ComponentProps } from 'react';
import { match, P } from 'ts-pattern';
import useSlidingWindow from '~/scene/Play/Game/GainDisplay/useSlidingWindow';
import { COLS } from '~/scene/Play/Game/params';
import { useCamera } from '~/scene/shared';
import { PlaneCombo, Gain } from '../gameplay';
import { LineCoord, Plane } from '../types';
import { translate } from '../utils';
import GainLine from './GainLine';

type Props = {
  camera: {
    position: 'c1' | 'c2' | 'c3' | 'c4';
    relativeAxis: ReturnType<typeof useCamera>[2];
  };
  gain: Gain;
};

export default function GainDisplay(props: Props) {
  const primaryPlane =
    props.gain.lines.filter((l) => 'x' in l).length >
    props.gain.lines.filter((l) => 'z' in l).length
      ? 'z'
      : 'x';

  const sortedLines = props.gain.lines.toSorted(
    lineOrderCriteria(props.camera.relativeAxis, primaryPlane),
  );

  const firstLine = sortedLines[0];
  const gainLineProps: Omit<
    ComponentProps<typeof GainLine> & { id: string },
    'lineNumber'
  >[] = sortedLines.map((line) => {
    const id = [line.x ?? '_', line.y, line.z ?? '_'].join(':');
    const layout = getPositioning(line, props.camera);
    const kind: PlaneCombo = match([firstLine, line])
      .with([{ x: P.number }, { x: P.number }], ([first, thiz]) =>
        first.x !== thiz.x ? 'parallel' : 'mono',
      )
      .with([{ z: P.number }, { z: P.number }], ([first, thiz]) =>
        first.z !== thiz.z ? 'parallel' : 'mono',
      )
      .otherwise(() => 'orthogonal');
    return { id, kind, ...layout };
  });

  const visibleWindow = useSlidingWindow(gainLineProps.length);

  return gainLineProps.map(
    (line, i) =>
      visibleWindow.includes(i) && (
        <GainLine
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

const lineOrderCriteria =
  (relativeAxis: ReturnType<typeof useCamera>[2], primaryPlane: Plane) =>
  (a: LineCoord, b: LineCoord) => {
    const xInverted = relativeAxis.x.forwardInverted;
    const zInverted = relativeAxis.z.forwardInverted;

    const yDiff = a.y - b.y;

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
    rotation: [0, yRotation, 0] satisfies [number, number, number],
    alignment,
  };
}
