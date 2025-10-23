import { LineCoord } from '~/scene/Play/Game/types';

export type Progress = {
  score: number;
  level: number;
};

export type PlaneCombo = 'mono' | 'parallel' | 'orthogonal';

export type ScoreEvent = { id: number; points: number } & (
  | ({ kind: 'line-clear' } & LineClearEvent)
  | ({ kind: 'hard-drop' } & HardDropEvent)
);

export type LineClearEvent = {
  lines: LineCoord[];
  planeCombo: PlaneCombo;
  cascade: number;
};

export type HardDropEvent = {
  length: number;
};
