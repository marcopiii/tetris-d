import * as THREE from 'three';
import { VOXEL_SIZE } from '../params';
import { voxelMaterials } from '../scene/assets/r3fMaterials';
import { Char } from '../scene/font';
import Voxel from './Voxel';

type Props = {
  position: THREE.Vector3Like;
  shape: Char;
  type: 'main' | 'primary' | 'secondary';
};

export default function R3FChar(props: Props) {
  const position = new THREE.Vector3(
    props.position.x,
    props.position.y,
    props.position.z,
  );
  const size = VOXEL_SIZE[props.type];
  const material = voxelMaterials[props.type];

  return (
    <group position={position}>
      {props.shape.map((row, y) =>
        row.map((v, x) => {
          if (v) {
            const position = { x: x * size, y: -y * size, z: 0 };
            return (
              <Voxel position={position} size={size} material={material} />
            );
          }
        }),
      )}
    </group>
  );
}
