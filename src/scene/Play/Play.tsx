import React from 'react';
import { match } from 'ts-pattern';
import { Progress } from '~/scene/Play/Game/gameplay';
import {
  GameMode,
  gameModeParams,
  GameParamsProvider,
} from '~/scene/Play/Game/params';
import Game from './Game';
import GameOver from './GameOver';

type Props = {
  mode: GameMode;
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

  return (
    <GameParamsProvider value={gameModeParams[props.mode]}>
      {match(state)
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
        .exhaustive()}
    </GameParamsProvider>
  );
}
