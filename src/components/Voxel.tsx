import * as THREE from 'three';

type Props = {
  position: [number, number, number];
  size: number;
  material: [
    THREE.MeshBasicMaterialParameters,
    THREE.MeshBasicMaterialParameters,
    THREE.MeshBasicMaterialParameters,
  ];
};

export default function Voxel(props: Props) {
  const size = [props.size, props.size, props.size] as const;

  return (
    <mesh position={props.position}>
      <boxGeometry args={size} />
      <meshBasicMaterial attach={`material-0`} {...props.material[0]} />
      <meshBasicMaterial attach={`material-1`} {...props.material[0]} />
      <meshBasicMaterial attach={`material-2`} {...props.material[1]} />
      <meshBasicMaterial attach={`material-3`} {...props.material[1]} />
      <meshBasicMaterial attach={`material-4`} {...props.material[2]} />
      <meshBasicMaterial attach={`material-5`} {...props.material[2]} />
    </mesh>
  );
}
