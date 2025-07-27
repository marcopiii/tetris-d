import React from 'react';
import { createRoot } from 'react-dom/client';
import { Canvas } from '@react-three/fiber';
import { MainMenu } from './MainMenu';
import './style.css';

function App(props: { aspectRatio: number }) {
  const frustumHeight = 22;

  const frustumProps = {
    left: (-frustumHeight * props.aspectRatio) / 2,
    right: (frustumHeight * props.aspectRatio) / 2,
    top: frustumHeight / 2,
    bottom: -frustumHeight / 2,
    near: 0.1,
    far: 1000,
    frustumCulled: true,
  };

  const cameraPosition = [-10, 4, 10] as const;

  return (
    <Canvas
      orthographic
      camera={{ ...frustumProps, position: cameraPosition }}
      dpr={window.devicePixelRatio}
    >
      <axesHelper args={[10]} />
      <MainMenu
        onPvE={() => console.log('play')}
        onControls={() => console.log('controls')}
        onAbout={() => console.log('about')}
      />
    </Canvas>
  );
}

const root = document.getElementById('root')!;
createRoot(root).render(
  <App aspectRatio={root.clientWidth / root.clientHeight} />,
);
