import { Center } from '@react-three/drei';
import { Word } from '../../../shared';

export default function LabeledNumber(props: {
  position: [number, number, number];
  label: string;
  value: number;
  isPaused: boolean;
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
      <Word
        position={[0, 0, 0]}
        alignX="left"
        text={props.label}
        type="secondary"
        font="alphabet"
        disabled={props.isPaused}
      />
      <Word
        position={[0, -1.5, 0]}
        alignX="left"
        text={props.value.toString()}
        type="primary"
        font="numbers"
        disabled={props.isPaused}
      />
    </Center>
  );
}
