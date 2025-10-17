import { LineCoord } from '../../types';

export type ComboKind = 'std' | 'ort' | 'par';

export type Gain = {
  lines: LineCoord[];
  kind: ComboKind;
  cascade: number;
  points: number;
};
