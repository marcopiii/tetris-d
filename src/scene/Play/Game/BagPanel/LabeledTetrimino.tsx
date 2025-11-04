import { Center } from '@react-three/drei';
import Mino from '~/scene/Play/Game/Mino';
import { Word } from '~/scene/shared';
import { Tetrimino, tetriminos } from '~/tetrimino';

export default function LabeledTetrimino(props: {
  position: [number, number, number];
  label: string;
  tetrimino?: Tetrimino;
  isPaused: boolean;
}) {
  return (
    <group position={props.position}>
      <Word
        position={[0, 0, 0]}
        alignX="center"
        alignZ="back"
        text={props.label}
        type="secondary"
        font="alphabet"
        disabled={props.isPaused}
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
                    status={props.isPaused ? 'disabled' : 'normal'}
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
