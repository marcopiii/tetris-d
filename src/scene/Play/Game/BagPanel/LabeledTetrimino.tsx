import { Center } from '@react-three/drei';
import { match } from 'ts-pattern';
import Mino from '../Mino';
import { Plane } from '../types';
import { Word } from '~/scene/shared';
import { Tetrimino, tetriminos } from '~/tetrimino';

export default function LabeledTetrimino(props: {
  position: [number, number, number];
  label: string;
  tetrimino?: Tetrimino;
  plane: Plane;
  isPaused: boolean;
  camera: 'c1' | 'c2' | 'c3' | 'c4';
}) {
  const rotation = match([props.camera, props.plane])
    .with(['c1', 'x'], () => 0)
    .with(['c2', 'x'], () => -Math.PI / 2)
    .with(['c3', 'x'], () => Math.PI)
    .with(['c4', 'x'], () => Math.PI / 2)
    .with(['c1', 'z'], () => Math.PI / 2)
    .with(['c2', 'z'], () => 0)
    .with(['c3', 'z'], () => -Math.PI / 2)
    .with(['c4', 'z'], () => Math.PI)
    .exhaustive();

  return (
    <group position={props.position}>
      <Word
        position={[0, 0, 0]}
        alignX="center"
        alignZ="back"
        text={props.label}
        textStyle="hudLabel"
        disabled={props.isPaused}
      />
      {props.tetrimino && (
        <Center
          position={[0, -2, 0]}
          rotation={[0, rotation, 0]}
          front
          cacheKey={props.tetrimino}
        >
          {tetriminos[props.tetrimino].map((layer, dy) =>
            layer.map(
              (exists, dx) =>
                exists && (
                  <Mino
                    type={props.tetrimino!}
                    position={[dx, -dy, 0]}
                    status={props.isPaused ? 'disabled' : 'normal'}
                  />
                ),
            ),
          )}
        </Center>
      )}
    </group>
  );
}
