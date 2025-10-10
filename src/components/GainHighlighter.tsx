import { match, P } from 'ts-pattern';
import { COLS } from '../params';
import Mino from './Mino';
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

  return (
    <Mino position={pointsPosition} type="S" status="normal" />
    // <R3FWord
    //   position={pointsPosition}
    //   text={`+${props.gain.points.toString()}`}
    //   type="secondary-half"
    //   font="numbers"
    // />
  );
}
