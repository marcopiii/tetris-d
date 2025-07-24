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
      {props.material.map((materialParams, i) => (
        <meshBasicMaterial {...materialParams} key={i} />
      ))}
    </mesh>
  );
}
