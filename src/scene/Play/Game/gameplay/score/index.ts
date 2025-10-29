import { useScoreTracker, EVENT_LIFESPAN_MS } from './useScoreTracker';
import type { PlaneCombo, Progress, TSpinKind } from './types';
import type {
  ScoreEvent,
  LineClearEvent,
  TSpinEvent,
  PerfectClearEvent,
} from './ScoreEvent';

export { useScoreTracker, EVENT_LIFESPAN_MS };
export type {
  PlaneCombo,
  ScoreEvent,
  Progress,
  LineClearEvent,
  TSpinEvent,
  TSpinKind,
  PerfectClearEvent,
};
