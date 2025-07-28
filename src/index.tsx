import React from 'react';
import { createRoot } from 'react-dom/client';
import { match } from 'ts-pattern';
import Board from './components/Board';
import { GameCanvas } from './components/GameCanvas';
import Tetrimino from './components/Tetrimino';
import Tetrion from './components/Tetrion';
import { MainMenu } from './MainMenu';
import './style.css';
import { Board as BoardMatrix } from './scenario/game/Board';
import { Piece } from './scenario/game/Piece';

type Scenario = 'main-menu' | 'play' | 'controls';

function App(props: { aspectRatio: number }) {
  const [scenario, setScenario] = React.useState<Scenario>('main-menu');

  const currentScenario = match(scenario)
    .with('main-menu', () => (
      <MainMenu
        onPlay={() => setScenario('play')}
        onControls={() => setScenario('controls')}
      />
    ))
    .with('play', () => (
      <>
        <Tetrion />
        <Board board={new BoardMatrix()} />
        <Tetrimino tetrimino={new Piece('S', 'z')} />
      </>
    ))
    .with('controls', () => <></>)
    .exhaustive();

  return (
    <GameCanvas aspectRatio={props.aspectRatio}>
      <axesHelper args={[10]} />
      {currentScenario}
    </GameCanvas>
  );
}

const root = document.getElementById('root')!;
createRoot(root).render(
  <App aspectRatio={root.clientWidth / root.clientHeight} />,
);
