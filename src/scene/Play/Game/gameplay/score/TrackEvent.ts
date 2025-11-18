import { TSpinKind, ZicKind } from './types';
import { LineCoord, PlaneCoords } from '~/scene/Play/Game/types';

export type TrackData = {
  rewardingMove?: RewardingMoveData;
  clearing?: LineClearData;
  perfectClear?: PerfectClearData[];
};

type RewardingMoveData =
  | { move: 'soft-drop' }
  | ({ move: 'hard-drop' } & HardDropData)
  | ({ move: 't-spin' } & TSpinData)
  | ({ move: 'zic' } & ZicData);

export type HardDropData = {
  length: number;
};

export type TSpinData = {
  kind: TSpinKind;
  pivot: LineCoord;
};

export type ZicData = {
  kind: ZicKind;
  rails:
    | Extract<LineCoord, { x: number }>[]
    | Extract<LineCoord, { z: number }>[];
};

export type LineClearData = {
  lines: LineCoord[];
  isCascade: boolean;
};

export type PerfectClearData = {
  plane: PlaneCoords;
  lines: number;
};
