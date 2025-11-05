import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

export function Background() {
  const texture = useTexture('textures/background_10.jpg');

  const rotation = [0, -Math.PI / 2, 0] satisfies THREE.EulerTuple;

  return (
    <>
      <ambientLight intensity={2.5} />
      <mesh rotation={rotation}>
        <sphereGeometry args={[20, 64, 64]} />
        <meshStandardMaterial map={texture} side={THREE.BackSide} fog={false} />
      </mesh>
    </>
  );
}
