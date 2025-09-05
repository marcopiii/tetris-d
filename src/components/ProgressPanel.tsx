import { Center } from '@react-three/drei';
import { match } from 'ts-pattern';
import { COLS, ROWS } from '../params';
import R3FWord from './R3FWord';

type Props = {
  camera: 'c1' | 'c2' | 'c3' | 'c4';
  score: number;
  level: number;
};

export default function ProgressPanel(props: Props) {
  const pY = (ROWS - 2) / 2;
  const onEdge = COLS / 2;
  const offEdge = (COLS + 2) / 2;

  const position = match<typeof props.camera, [number, number, number]>(
    props.camera,
  )
    .with('c1', () => [-offEdge, pY, -onEdge])
    .with('c2', () => [-onEdge, pY, offEdge])
    .with('c3', () => [offEdge, pY, onEdge])
    .with('c4', () => [onEdge, pY, -offEdge])
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
      <LabeledNumber
        position={[0, -3.5, 0]}
        label="level"
        value={props.level}
      />
    </group>
  );
}

function LabeledNumber(props: {
  position: [number, number, number];
  label: string;
  value: number;
}) {
  const centerCacheKey = props.value.toString.length;

  return (
    <Center
      front
      disableX
      disableY
      bottom
      position={props.position}
      cacheKey={centerCacheKey}
    >
      <R3FWord
        position={[0, 0, 0]}
        alignX="left"
        text={props.label}
        type="secondary"
        font="alphabet"
      />
      <R3FWord
        position={[0, -1.5, 0]}
        alignX="left"
        text={props.value.toString()}
        type="primary"
        font="numbers"
      />
    </Center>
  );
}
