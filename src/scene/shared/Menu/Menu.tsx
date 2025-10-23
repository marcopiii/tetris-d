import { VOXEL_SIZE } from '../params';
import Word from '../Word';
import { SelectableMenuItem } from './types';

type MenuProps = {
  position: [number, number, number];
  title: string;
  options: SelectableMenuItem[];
};

export default function Menu(props: MenuProps) {
  const lhMain = VOXEL_SIZE.main * 15;
  const lhPrimary = VOXEL_SIZE.primary * 10;

  return (
    <group position={props.position}>
      <Word
        text={props.title}
        type="main"
        font="alphabet"
        alignX="center"
        position={[0, lhMain, 0]}
      />
      {props.options.map((option, i) => (
        <Word
          key={`${i}.${option.name}`}
          text={option.name}
          type={option.selected ? 'primary' : 'secondary'}
          font="alphabet"
          alignX="center"
          alignY="center"
          position={[
            0,
            -(lhPrimary * i),
            option.selected ? VOXEL_SIZE.primary * 3 : 0,
          ]}
        />
      ))}
    </group>
  );
}
