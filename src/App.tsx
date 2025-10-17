import React from 'react';
import { match } from 'ts-pattern';
import { Canvas } from './Canvas';
import { Leaderboard, MainMenu, Play } from '~/scene';
import './style.css';

type Scenario = 'main-menu' | 'play' | 'controls' | 'leaderboard';

export default function App(props: { aspectRatio: number }) {
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
    .with('leaderboard', () => (
      <Leaderboard onBack={() => setScenario('main-menu')} />
    ))
    .with('controls', () => <></>)
    .exhaustive();

  return <Canvas aspectRatio={props.aspectRatio}>{currentScenario}</Canvas>;
}
