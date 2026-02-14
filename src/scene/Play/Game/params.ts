import React from 'react';

export type GameParams = {
  cols: number;
  rows: number;
  vanishZoneRows: number;
};

export type GameMode = '7x7' | '5x5';

export const gameModeParams: Record<GameMode, GameParams> = {
  '7x7': { cols: 7, rows: 14, vanishZoneRows: 3 },
  '5x5': { cols: 5, rows: 10, vanishZoneRows: 3 },
};

const GameParamsContext = React.createContext<GameParams>(gameModeParams['7x7']);

export const GameParamsProvider = GameParamsContext.Provider;

export function useGameParams(): GameParams {
  return React.useContext(GameParamsContext);
}
