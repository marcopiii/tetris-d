import { Center } from '@react-three/drei';
import { match, P } from 'ts-pattern';
import { alphabet, Char, numbers } from '~/font';
import { VOXEL_SIZE } from '../params';
import Character from './Char';

type Props = {
  position: [number, number, number];
  rotation?: [number, number, number];
  text: string;
  type: 'main' | 'primary' | 'primary-half' | 'secondary' | 'secondary-half';
  font: 'alphabet' | 'numbers';
  disabled?: boolean;
  alignX?: 'left' | 'center' | 'right';
  alignY?: 'top' | 'center' | 'bottom';
  alignZ?: 'front' | 'center' | 'back';
};

export default function Word(props: Props) {
  const font = match(props.font)
    .with('alphabet', () => alphabet)
    .with('numbers', () => numbers)
    .exhaustive();

  const chars: Array<Char> = props.text.split('').map((char) => font[char]);

  const charWidths = chars.map((shape) => shape[0].length);
  const charOffsets = chars.map((_, i) =>
    i === 0
      ? 0
      : charWidths.slice(0, i).reduce((acc, width) => acc + width + 1, 0),
  );

  const centerPropsX = match(props.alignX)
    .with('left', () => ({ left: true }))
    .with('center', () => ({}))
    .with('right', () => ({ right: true }))
    .with(P.nullish, () => ({ disableX: true }))
    .exhaustive();

  const centerPropsY = match(props.alignY)
    .with('top', () => ({ top: true }))
    .with('center', () => ({}))
    .with('bottom', () => ({ bottom: true }))
    .with(P.nullish, () => ({ disableY: true }));

  const centerPropsZ = match(props.alignZ)
    .with('front', () => ({ front: true }))
    .with('center', () => ({}))
    .with('back', () => ({ back: true }))
    .with(P.nullish, () => ({ disableZ: true }));

  const centerCacheKey = [
    props.text,
    props.type,
    props.font,
    props.disabled,
  ].join('-');

  return (
    <Center
      {...centerPropsX}
      {...centerPropsY}
      {...centerPropsZ}
      position={props.position}
      rotation={props.rotation}
      cacheKey={centerCacheKey}
    >
      {chars.map((char, i) => {
        const offset =
          charOffsets[i] *
          VOXEL_SIZE[
            props.type === 'secondary-half' ? 'secondary' : props.type
          ];
        return (
          <Character
            position={[offset, 0, 0]}
            char={char}
            type={props.type}
            disabled={props.disabled}
            key={i}
          />
        );
      })}
    </Center>
  );
}
