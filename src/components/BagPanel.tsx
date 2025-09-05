import { Center } from '@react-three/drei';
import { match } from 'ts-pattern';
import { COLS, ROWS } from '../params';
import Mino from './Mino';
import R3FWord from './R3FWord';
import { tetriminos } from '../tetrimino';
import { Name as TetriminoType } from '../tetrimino/types';

type Props = {
  next: TetriminoType;
  hold?: TetriminoType;
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

function LabeledTetrimino(props: {
  position: [number, number, number];
  label: string;
  tetrimino?: TetriminoType;
}) {
  return (
    <group position={props.position}>
      <R3FWord
        position={[0, 0, 0]}
        alignX="center"
        alignZ="back"
        text={props.label}
        type="secondary"
        font="alphabet"
      />
      {props.tetrimino && (
        <Center position={[0, -2, 0]} front cacheKey={props.tetrimino}>
          {tetriminos[props.tetrimino].map((layer, dy) =>
            layer.map((exists, dx) => {
              return (
                exists && (
                  <Mino
                    type={props.tetrimino!}
                    position={[dx, -dy, 0]}
                    status="normal"
                  />
                )
              );
            }),
          )}
        </Center>
      )}
    </group>
  );
}
