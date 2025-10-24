import { match } from 'ts-pattern';
import { Popup } from '~/scene/shared';
import { Progress, ScoreEvent } from '../gameplay';
import { COLS, ROWS } from '../params';
import LabeledNumber from './LabeledNumber';

type Props = {
  camera: 'c1' | 'c2' | 'c3' | 'c4';
  progress: Progress;
  scoreEventStream: ScoreEvent[];
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
      <LabeledNumber
        position={[0, 0, 0]}
        label="score"
        value={props.progress.score}
      />
      {props.scoreEventStream.map(({ points, id }) => (
        <Popup
          key={id}
          position={[0, -1.5, 0.15]}
          rotation={0}
          alignX="left"
          text={`+${points.toString()}`}
          toward="fw"
          distance={2}
        />
      ))}
      <LabeledNumber
        position={[0, -3.5, 0]}
        label="level"
        value={props.progress.level}
      />
    </group>
  );
}
