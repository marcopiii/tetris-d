import { match } from 'ts-pattern';
import { COLS, ROWS } from '../params';
import R3FWord from './R3FWord';

type Props = {
  camera: 'c1' | 'c2' | 'c3' | 'c4';
  score: number;
  level: number;
};

export default function ProgressPanel(props: Props) {
  const position = match<typeof props.camera, [number, number, number]>(
    props.camera,
  )
    .with('c1', () => [-(COLS + 1) / 2, (ROWS - 2) / 2, -COLS / 2])
    .with('c2', () => [-COLS / 2, (ROWS - 2) / 2, (COLS + 1) / 2])
    .with('c3', () => [COLS / 2, (ROWS - 2) / 2, (COLS + 1) / 2])
    .with('c4', () => [(COLS + 1) / 2, (ROWS - 2) / 2, -COLS / 2])
    .exhaustive();

  const rotation = match<typeof props.camera, [number, number, number]>(
    props.camera,
  )
    .with('c1', () => [0, 0, 0])
    .with('c2', () => [0, Math.PI / 2, 0])
    .with('c3', () => [0, Math.PI, 0])
    .with('c4', () => [0, -Math.PI / 2, 0])
    .exhaustive();

  return (
    <group position={position} rotation={rotation}>
      <LabeledNumber position={[0, 0, 0]} label="score" value={props.score} />
      <LabeledNumber position={[0, -4, 0]} label="level" value={props.level} />
    </group>
  );
}

function LabeledNumber(props: {
  position: [number, number, number];
  label: string;
  value: number;
}) {
  return (
    <group position={props.position}>
      <R3FWord
        position={[0, 0, 0]}
        text={props.label}
        type="secondary"
        font="alphabet"
      />
      <R3FWord
        position={[0, -1.5, 0]}
        text={props.value.toString()}
        type="primary"
        font="numbers"
      />
    </group>
  );
}
