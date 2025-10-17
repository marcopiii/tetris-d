import { useLocalStorage } from '@uidotdev/usehooks';
import { ScoreRecord } from './types';

export default function useLeaderboard(): ScoreRecord[] {
  const [leaderboard] = useLocalStorage<Omit<ScoreRecord, 'rank'>[]>(
    't3d-leaderboard',
    [],
  );

  return leaderboard
    .sort((a, b) => b.score - a.score)
    .map((e, i) => ({ rank: i + 1, ...e }));
}
