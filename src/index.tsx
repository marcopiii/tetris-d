import { EffectComposer, Bloom } from '@react-three/postprocessing';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { match } from 'ts-pattern';
import { GameCanvas } from './components/GameCanvas';
import Leaderboard from './components/Leaderboard';
import Play from './components/Play';
import { MainMenu } from './MainMenu';
import './style.css';

type Scenario = 'main-menu' | 'play' | 'controls' | 'leaderboard';

function App(props: { aspectRatio: number }) {
  const [scenario, setScenario] = React.useState<Scenario>('main-menu');

  const currentScenario = match(scenario)
    .with('main-menu', () => (
      <MainMenu
        onPlay={() => setScenario('play')}
        onControls={() => setScenario('controls')}
        onLeaderboard={() => setScenario('leaderboard')}
      />
    ))
    .with('play', () => <Play onBack={() => setScenario('main-menu')} />)
    .with('leaderboard', () => <Leaderboard />)
    .with('controls', () => <></>)
    .exhaustive();

  return (
    <GameCanvas aspectRatio={props.aspectRatio}>
      <axesHelper args={[10]} />
      <EffectComposer>
        <Bloom
          luminanceThreshold={1}
          luminanceSmoothing={0.5}
          intensity={1.0}
        />
      </EffectComposer>
      {currentScenario}
    </GameCanvas>
  );
}

const root = document.getElementById('root')!;
createRoot(root).render(
  <App aspectRatio={root.clientWidth / root.clientHeight} />,
);
