import * as THREE from 'three';

type Props = {
  position: [number, number, number];
  size: number;
  material: [
    THREE.MeshBasicMaterialParameters,
    THREE.MeshBasicMaterialParameters,
    THREE.MeshBasicMaterialParameters,
  ];
  hideFace?: {
    'x+': boolean;
    'x-': boolean;
    'y+': boolean;
    'y-': boolean;
    'z+': boolean;
    'z-': boolean;
  };
};

export default function Voxel(props: Props) {
  const size = [props.size, props.size, props.size] as const;
  const hideFace = props.hideFace || {
    'x+': false,
    'x-': false,
    'y+': false,
    'y-': false,
    'z+': false,
    'z-': false,
  };

  return (
    <mesh position={props.position}>
      <boxGeometry args={size} />
      {!hideFace['x+'] && (
        <meshBasicMaterial
          key="x+"
          attach="material-0"
          {...props.material[0]}
        />
      )}
      {!hideFace['x-'] && (
        <meshBasicMaterial
          key="x-"
          attach="material-1"
          {...props.material[0]}
        />
      )}
      {!hideFace['y+'] && (
        <meshBasicMaterial
          key="y+"
          attach="material-2"
          {...props.material[1]}
        />
      )}
      {!hideFace['y-'] && (
        <meshBasicMaterial
          key="y-"
          attach="material-3"
          {...props.material[1]}
        />
      )}
      {!hideFace['z+'] && (
        <meshBasicMaterial
          key="z+"
          attach="material-4"
          {...props.material[2]}
        />
      )}
      {!hideFace['z-'] && (
        <meshBasicMaterial
          key="z-"
          attach="material-5"
          {...props.material[2]}
        />
      )}
    </mesh>
  );
}
