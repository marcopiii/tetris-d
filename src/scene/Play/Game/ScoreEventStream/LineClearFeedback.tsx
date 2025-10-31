import { ComponentProps } from 'react';
import { match, P } from 'ts-pattern';
import { LineClearEvent } from '../gameplay';
import comboName from './comboName';
import useSlidingWindow from './useSlidingWindow';
import { COLS } from '../params';
import { Popup, useCamera } from '~/scene/shared';
import { PlaneCombo } from '../gameplay';
import { LineCoord, Plane } from '../types';
import { translate } from '../utils';

type Props = {
  camera: {
    position: 'c1' | 'c2' | 'c3' | 'c4';
    relativeAxes: ReturnType<typeof useCamera>['relativeAxes'];
  };
  event: LineClearEvent;
};

export default function LineClearFeedback(props: Props) {
  const primaryPlane =
    props.event.lines.filter((l) => 'x' in l).length >
    props.event.lines.filter((l) => 'z' in l).length
      ? 'z'
      : 'x';

  const sortedLines = props.event.lines.toSorted(
    lineOrderCriteria(props.camera.relativeAxes, primaryPlane),
  );

  const firstLine = sortedLines[0];

  const popups: (ComponentProps<typeof Popup> & { id: string })[] =
    sortedLines.map((line, i) => {
      const id = [line.x ?? '_', line.y, line.z ?? '_'].join(':');
      const layout = getPositioning(line, props.camera);
      const planeCombo: PlaneCombo = match([firstLine, line])
        .with([{ x: P.number }, { x: P.number }], ([first, thiz]) =>
          first.x !== thiz.x ? 'parallel' : 'mono',
        )
        .with([{ z: P.number }, { z: P.number }], ([first, thiz]) =>
          first.z !== thiz.z ? 'parallel' : 'mono',
        )
        .otherwise(() => 'orthogonal');

      const text = comboName(i + 1, props.event.cascade, planeCombo);
      return { ...layout, id, text, distance: 1 };
    });

  const visibleWindow = useSlidingWindow(popups.length);

  return popups.map(
    (popupProps, i) =>
      visibleWindow.includes(i) && (
        <Popup {...popupProps} key={popupProps.id} />
      ),
  );
}

const lineOrderCriteria =
  (
    relativeAxes: ReturnType<typeof useCamera>['relativeAxes'],
    primaryPlane: Plane,
  ) =>
  (a: LineCoord, b: LineCoord) => {
    const xInverted = relativeAxes.x.forwardInverted;
    const zInverted = relativeAxes.z.forwardInverted;

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

  const [rotation, alignment] = match([line, camera.position])
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
    rotation,
    alignX: alignment,
    toward: alignment === 'left' ? ('sx' as const) : ('rx' as const),
  };
}
