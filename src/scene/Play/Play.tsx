import React from 'react';
import { match } from 'ts-pattern';
import { Progress } from '~/scene/Play/Game/gameplay';
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
      result: Progress;
    };

export default function Play(props: Props) {
  const [state, setState] = React.useState<ScenarioState>({ state: 'playing' });

  return match(state)
    .with({ state: 'playing' }, () => (
      <Game
        onGameOver={(progress) =>
          setState({ state: 'game-over', result: progress })
        }
      />
    ))
    .with({ state: 'game-over' }, ({ result }) => (
      <GameOver onBack={props.onBack} result={result} />
    ))
    .exhaustive();
}
