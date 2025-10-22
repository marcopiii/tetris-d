import React from 'react';
import { match } from 'ts-pattern';
import Game from './Game';
import GameOver from './GameOver';

type Props = {
  onBack: () => void;
};

type ScenarioState =
  | {
      state: 'playing';
    }
  | {
      state: 'game-over';
      result: React.ComponentProps<typeof GameOver>['result'];
    };

export default function Play(props: Props) {
  const [state, setState] = React.useState<ScenarioState>({ state: 'playing' });

  return match(state)
    .with({ state: 'playing' }, () => (
      <Game
        onGameOver={(score, level) =>
          setState({ state: 'game-over', result: { score, level } })
        }
      />
    ))
    .with({ state: 'game-over' }, ({ result }) => (
      <GameOver onBack={props.onBack} result={result} />
    ))
    .exhaustive();
}
