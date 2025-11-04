import { PlaneCombo } from '~/scene/Play/Game/gameplay';
import { LineCoord, PlaneCoords } from '~/scene/Play/Game/types';

export type ScoreEvent = { id: number; points: number } & (
  | ({ kind: 'line-clear' } & LineClearEvent)
  | ({ kind: 'combo' } & ComboEvent)
  | ({ kind: 'perfect-clear' } & PerfectClearEvent)
  | { kind: 'soft-drop' }
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

type ComboEvent = {
  count: number;
};
