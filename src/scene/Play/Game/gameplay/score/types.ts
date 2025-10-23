import { LineCoord } from '~/scene/Play/Game/types';

export type PlaneCombo = 'mono' | 'parallel' | 'orthogonal';

export type ScoreEvent = {
  lines: LineCoord[];
  planeCombo: PlaneCombo;
  cascade: number;
};
