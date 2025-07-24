import * as THREE from 'three';

type Props = {
  position: THREE.Vector3Like;
  size: number;
  material: [
    THREE.MeshBasicMaterialParameters,
    THREE.MeshBasicMaterialParameters,
    THREE.MeshBasicMaterialParameters,
  ];
};

export default function Voxel(props: Props) {
  const position = new THREE.Vector3(
    props.position.x,
    props.position.y,
    props.position.z,
  );

  const size = [props.size, props.size, props.size] as const;

  return (
    <mesh position={position}>
      <boxGeometry args={size} />
      {props.material.map((materialParams) => (
        <meshBasicMaterial {...materialParams} />
      ))}
    </mesh>
  );
}
