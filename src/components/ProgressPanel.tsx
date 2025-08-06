import R3FWord from './R3FWord';

type Props = {
  position: [number, number, number];
  rotation: [number, number, number];
};

export default function ProgressPanel(props: Props) {
  return (
    <group position={props.position} rotation={props.rotation}>
      <LabeledNumber position={[0, 0, 0]} label="score" value={123456} />
      <LabeledNumber position={[0, -4, 0]} label="level" value={5} />
    </group>
  );
}

function LabeledNumber(props: {
  position: [number, number, number];
  label: string;
  value: number;
}) {
  return (
    <group position={props.position}>
      <R3FWord
        position={[0, 0, 0]}
        text={props.label}
        type="secondary"
        font="alphabet"
      />
      <R3FWord
        position={[0, -1.5, 0]}
        text={props.value.toString()}
        type="primary"
        font="numbers"
      />
    </group>
  );
}
