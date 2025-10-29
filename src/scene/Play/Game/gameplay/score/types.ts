import { LineCoord, PlaneCoords } from '~/scene/Play/Game/types';

export type Progress = {
  score: number;
  level: number;
};

export type PlaneCombo = 'mono' | 'parallel' | 'orthogonal';

export type TSpinKind = 'mini' | 'full';

export type ScoreEvent = { id: number; points: number } & (
  | ({ kind: 'line-clear' } & LineClearEvent)
  | ({ kind: 'perfect-clear' } & PerfectClearEvent)
  | { kind: 'hard-drop' }
  | ({ kind: 't-spin' } & TSpinEvent)
);

export type LineClearEvent = {
  lines: LineCoord[];
  planeCombo: PlaneCombo;
  cascade: number;
};

export type PerfectClearEvent = {
  planes: PlaneCoords[];
  planeCombo: PlaneCombo;
};

export type TSpinEvent = {
  mini: boolean;
  pivot: LineCoord;
};
