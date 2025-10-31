import { match, P } from 'ts-pattern';
import { COLS } from '../params';
import { translate } from '../utils';
import { TSpinEvent } from '../gameplay';
import { Popup, useCamera } from '~/scene/shared';

type Props = {
  camera: {
    position: 'c1' | 'c2' | 'c3' | 'c4';
    relativeAxes: ReturnType<typeof useCamera>['relativeAxes'];
  };
  event: TSpinEvent;
};

export default function TSpinFeedback(props: Props) {
  const [xAnchor, zAnchor] = match(props.camera.position)
    .with('c1', () => [-1, COLS])
    .with('c2', () => [COLS, COLS])
    .with('c3', () => [COLS, -1])
    .with('c4', () => [-1, -1])
    .exhaustive();

  const position = match(props.event.pivot)
    .with({ x: P.number }, ({ x, y }) => translate(x, y, zAnchor))
    .with({ z: P.number }, ({ z, y }) => translate(xAnchor, y, z))
    .exhaustive();

  const [rotation, alignment] = match([
    props.event.pivot,
    props.camera.position,
  ])
    .with([{ x: P.number }, 'c1'], () => [-Math.PI / 2, 'right'] as const)
    .with([{ x: P.number }, 'c2'], () => [Math.PI / 2, 'left'] as const)
    .with([{ x: P.number }, 'c3'], () => [Math.PI / 2, 'right'] as const)
    .with([{ x: P.number }, 'c4'], () => [-Math.PI / 2, 'left'] as const)
    .with([{ z: P.number }, 'c1'], () => [0, 'left'] as const)
    .with([{ z: P.number }, 'c2'], () => [0, 'right'] as const)
    .with([{ z: P.number }, 'c3'], () => [Math.PI, 'left'] as const)
    .with([{ z: P.number }, 'c4'], () => [-Math.PI, 'right'] as const)
    .exhaustive();

  return (
    <Popup
      position={position}
      rotation={rotation}
      alignX={alignment}
      toward={alignment === 'left' ? 'sx' : 'rx'}
      text={props.event.mini ? 'MINI T-SPIN' : 'T-SPIN'}
      distance={1}
    />
  );
}
