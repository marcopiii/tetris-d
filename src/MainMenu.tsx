import R3FWord from './components/R3FWord';

type Props = {
  onPvE: () => void;
  onControls: () => void;
  onAbout: () => void;
};

export function MainMenu(props: Props) {
  const options = [
    { name: 'play', action: props.onPvE, terminal: true },
    { name: 'controls', action: props.onControls, terminal: true },
    { name: 'about', action: props.onAbout, terminal: true },
  ];

  return <Menu options={options} />;
}

type MenuProps = {
  options: MenuItem[];
};

type MenuItem<T = never> = {
  name: string;
  accessory?: T;
  action: () => void;
  terminal?: boolean;
};

function Menu(props: MenuProps) {
  return (
    <group>
      <R3FWord
        position={[0, 0, 0]}
        text="tetris-d"
        type="main"
        font="alphabet"
      />
      {props.options.map((option, i) => (
        <R3FWord
          key={option.name}
          position={[0, -i * 6, 0]}
          text={option.name}
          type="primary"
          font="alphabet"
        />
      ))}
    </group>
  );
}
