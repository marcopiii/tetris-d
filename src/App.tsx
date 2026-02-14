import React from 'react';
import { match } from 'ts-pattern';
import { Canvas } from './Canvas';
import { Leaderboard, MainMenu, Play } from '~/scene';
import { GameMode } from '~/scene/Play/Game/params';
import './style.css';

type Scenario =
  | { kind: 'main-menu' }
  | { kind: 'play'; mode: GameMode }
  | { kind: 'controls' }
  | { kind: 'leaderboard' };

export default function App(props: { aspectRatio: number }) {
  const [scenario, setScenario] = React.useState<Scenario>({
    kind: 'main-menu',
  });

  const currentScenario = match(scenario)
    .with({ kind: 'main-menu' }, () => (
      <MainMenu
        onPlay={(mode) => setScenario({ kind: 'play', mode })}
        onControls={() => setScenario({ kind: 'controls' })}
        onLeaderboard={() => setScenario({ kind: 'leaderboard' })}
      />
    ))
    .with({ kind: 'play' }, ({ mode }) => (
      <Play mode={mode} onBack={() => setScenario({ kind: 'main-menu' })} />
    ))
    .with({ kind: 'leaderboard' }, () => (
      <Leaderboard onBack={() => setScenario({ kind: 'main-menu' })} />
    ))
    .with({ kind: 'controls' }, () => <></>)
    .exhaustive();

  return <Canvas aspectRatio={props.aspectRatio}>{currentScenario}</Canvas>;
}
