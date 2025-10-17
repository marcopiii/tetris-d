import { match } from 'ts-pattern';
import { COLS, ROWS } from '~/scene/Play/Game/params';
import { Tetrimino } from '~/tetrimino';
import LabeledTetrimino from './LabeledTetrimino';

type Props = {
  next: Tetrimino;
  hold?: Tetrimino;
  camera: 'c1' | 'c2' | 'c3' | 'c4';
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

  return (
    <group position={position} rotation={rotation}>
      <LabeledTetrimino
        position={[0, 0, 0]}
        label="next"
        tetrimino={props.next}
      />
      <LabeledTetrimino
        position={[0, -5, 0]}
        label="hold"
        tetrimino={props.hold}
      />
    </group>
  );
}
