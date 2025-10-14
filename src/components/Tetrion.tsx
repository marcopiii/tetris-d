import { useThree } from '@react-three/fiber';
import React from 'react';
import * as THREE from 'three';
import { COLS, MINO_SIZE, ROWS } from '../params';
import { tetrionMaterial } from '../scene/assets/materials';

const tetrionWallGeometry = new THREE.PlaneGeometry(
  COLS * MINO_SIZE,
  ROWS * MINO_SIZE,
);

const tetrionBaseGeometry = new THREE.ConeGeometry(
  (COLS * MINO_SIZE) / Math.sqrt(2),
  ROWS * MINO_SIZE,
  4,
);

export default function Tetrion() {
  const scene = useThree((rootState) => rootState.scene);

  React.useEffect(() => {
    // scene.fog = new THREE.Fog('black', 10, 70);
    scene.background = new THREE.Color('#b5c5d2');
    return () => {
      scene.fog = null;
      scene.background = null;
    };
  }, [scene]);

  return (
    <group>
      <gridHelper
        args={[COLS * MINO_SIZE, COLS, '#8797a4', '#8797a4']}
        position={[0, -ROWS / 2, 0]}
      />
      <TetrionWall position={[COLS / 2, 0, 0]} rotation={[0, Math.PI / 2, 0]} />
      <TetrionWall
        position={[-COLS / 2, 0, 0]}
        rotation={[0, -Math.PI / 2, 0]}
      />
      <TetrionWall position={[0, 0, -COLS / 2]} rotation={[0, 0, 0]} />
      <TetrionWall position={[0, 0, COLS / 2]} rotation={[0, Math.PI, 0]} />
      {/*<TetrionBase*/}
      {/*  position={[0, -ROWS, 0]}*/}
      {/*  rotation={[Math.PI, Math.PI / 4, 0]}*/}
      {/*/>*/}
    </group>
  );
}

function TetrionWall(props: {
  position: [number, number, number];
  rotation?: [number, number, number];
}) {
  return (
    <lineSegments position={props.position} rotation={props.rotation}>
      <edgesGeometry attach="geometry" args={[tetrionWallGeometry]} />
      <lineBasicMaterial attach="material" {...tetrionMaterial} />
    </lineSegments>
  );
}

function TetrionBase(props: {
  position: [number, number, number];
  rotation: [number, number, number];
}) {
  return (
    <mesh
      geometry={tetrionBaseGeometry}
      position={props.position}
      rotation={props.rotation}
    >
      <meshBasicMaterial color="#FFB3BA" side={THREE.DoubleSide} />
      <meshBasicMaterial color="red" side={THREE.DoubleSide} />
      <meshBasicMaterial color="#green" side={THREE.DoubleSide} />
      <meshBasicMaterial color="#blue" side={THREE.DoubleSide} />
    </mesh>
  );
}
