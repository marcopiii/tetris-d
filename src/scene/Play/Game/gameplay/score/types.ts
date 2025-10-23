import { LineCoord } from '../../types';

export type PlaneCombo = 'mono' | 'parallel' | 'orthogonal';

export type Gain = {
  lines: LineCoord[];
  planeCombo: PlaneCombo;
  cascade: number;
  points: number;
};
