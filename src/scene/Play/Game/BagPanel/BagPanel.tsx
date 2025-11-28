import { match } from 'ts-pattern';
import { COLS, ROWS } from '../params';
import { Plane } from '../types';
import { Tetrimino } from '~/tetrimino';
import LabeledTetrimino from './LabeledTetrimino';

type Props = {
  next: Tetrimino;
  hold?: Tetrimino;
  currentPlane: Plane;
  camera: 'c1' | 'c2' | 'c3' | 'c4';
  isPaused: boolean;
};

export default function BagPanel(props: Props) {
  const pY = (ROWS - 2) / 2;
  const onEdge = COLS / 2;
  const offEdge = (COLS + 5) / 2;

  const position = match<typeof props.camera, [number, number, number]>(
    props.camera,
  )
    .with('c1', () => [onEdge, pY, offEdge])
    .with('c2', () => [offEdge, pY, -onEdge])
    .with('c3', () => [-onEdge, pY, -offEdge])
    .with('c4', () => [-offEdge, pY, onEdge])
    .exhaustive();

  const rotation = match<typeof props.camera, [number, number, number]>(
    props.camera,
  )
    .with('c1', () => [0, -Math.PI / 2, 0])
    .with('c2', () => [0, 0, 0])
    .with('c3', () => [0, Math.PI / 2, 0])
    .with('c4', () => [0, Math.PI, 0])
    .exhaustive();

  const nextPlane = match(props.currentPlane)
    .with('x', () => 'z' as const)
    .with('z', () => 'x' as const)
    .exhaustive();

  return (
    <group position={position} rotation={rotation}>
      <LabeledTetrimino
        position={[0, 0, 0]}
        label="next"
        tetrimino={props.next}
        plane={nextPlane}
        isPaused={props.isPaused}
        camera={props.camera}
      />
      <LabeledTetrimino
        position={[0, -5, 0]}
        label="hold"
        tetrimino={props.hold}
        plane={props.currentPlane}
        isPaused={props.isPaused}
        camera={props.camera}
      />
    </group>
  );
}
