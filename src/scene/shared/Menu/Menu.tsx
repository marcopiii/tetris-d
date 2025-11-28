import { textStyleConfig } from '~/scene/shared/Word/textStyleConfig';
import Word from '../Word';
import { SelectableMenuItem } from './types';

type MenuProps = {
  position: [number, number, number];
  title: string;
  options: SelectableMenuItem[];
};

export default function Menu(props: MenuProps) {
  const lhMain = textStyleConfig.main.size * 15;
  const lhPrimary = textStyleConfig.menuSelected.size * 10;

  return (
    <group position={props.position}>
      <Word
        text={props.title}
        textStyle="main"
        alignX="center"
        position={[0, lhMain, 0]}
      />
      {props.options.map((option, i) => (
        <Word
          key={`${i}.${option.name}`}
          text={option.name}
          textStyle={option.selected ? 'menuSelected' : 'menu'}
          alignX="center"
          alignY="center"
          position={[
            0,
            -(lhPrimary * i),
            option.selected ? textStyleConfig.menuSelected.size * 3 : 0,
          ]}
        />
      ))}
    </group>
  );
}
