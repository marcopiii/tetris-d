import React from 'react';
import { match } from 'ts-pattern';
import Game from './Game';
import Leaderboard from './Leaderboard';

type Props = {
  onBack: () => void;
};

type ScenarioState =
  | {
      state: 'playing';
    }
  | {
      state: 'game-over';
      score: number;
      level: number;
    };

export default function Play(props: Props) {
  const [state, setState] = React.useState<ScenarioState>({ state: 'playing' });

  return match(state)
    .with({ state: 'playing' }, () => (
      <Game
        onGameOver={(score, level) =>
          setState({ state: 'game-over', score, level })
        }
      />
    ))
    .with({ state: 'game-over' }, ({ score, level }) => (
      <Leaderboard
        onBack={props.onBack}
        gameOver
        newScore={score}
        newLevel={level}
      />
    ))
    .exhaustive();
}
