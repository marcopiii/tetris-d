import React from 'react';
import { createRoot } from 'react-dom/client';
import { GameCanvas } from './components/GameCanvas';
import { MainMenu } from './MainMenu';
import './style.css';

function App(props: { aspectRatio: number }) {
  return (
    <GameCanvas aspectRatio={props.aspectRatio}>
      <axesHelper args={[10]} />
      <MainMenu
        onPvE={() => console.log('play')}
        onControls={() => console.log('controls')}
        onAbout={() => console.log('about')}
      />
    </GameCanvas>
  );
}

const root = document.getElementById('root')!;
createRoot(root).render(
  <App aspectRatio={root.clientWidth / root.clientHeight} />,
);
