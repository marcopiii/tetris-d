import { TSpinKind } from './types';
import { LineCoord, PlaneCoords } from '~/scene/Play/Game/types';

export type TrackData = {
  rewardingMove?: RewardingMoveData;
  clearing?: LineClearData;
  perfectClear?: PerfectClearData[];
};

type RewardingMoveData =
  | { move: 'soft-drop' }
  | ({ move: 'hard-drop' } & HardDropData)
  | ({ move: 't-spin' } & TSpinData);

export type HardDropData = {
  length: number;
};

export type TSpinData = {
  kind: TSpinKind;
  pivot: LineCoord;
};

export type LineClearData = {
  lines: LineCoord[];
  isCascade: boolean;
};

export type PerfectClearData = {
  plane: PlaneCoords;
  lines: number;
};
