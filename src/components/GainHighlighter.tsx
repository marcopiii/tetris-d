import { match, P } from 'ts-pattern';
import { COLS } from '../params';
import R3FWord from './R3FWord';
import { translate } from './translations';
import useScoreTracker from './useScoreTracker';

type Props = {
  camera: 'c1' | 'c2' | 'c3' | 'c4';
  gain: NonNullable<ReturnType<typeof useScoreTracker>['gain']>;
};

export default function GainHighlighter(props: Props) {
  const firstLine = props.gain.lines[0];
  if (!firstLine) return null;

  const [xAnchor, zAnchor] = match(props.camera)
    .with('c1', () => [-1, COLS])
    .with('c2', () => [COLS, COLS])
    .with('c3', () => [COLS, -1])
    .with('c4', () => [-1, -1])
    .exhaustive();

  const pointsPosition = match(firstLine)
    .with({ x: P.number }, ({ x, y }) => translate(x, y, zAnchor))
    .with({ z: P.number }, ({ z, y }) => translate(xAnchor, y, z))
    .exhaustive();

  const [pointsRotation, pointsAlign] = match([firstLine, props.camera])
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
    <R3FWord
      position={pointsPosition}
      rotation={[0, pointsRotation, 0]}
      alignX={pointsAlign}
      text={`+${props.gain.points.toString()}`}
      type="secondary-half"
      font="numbers"
    />
  );
}
