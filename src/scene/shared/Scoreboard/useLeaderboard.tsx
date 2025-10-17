import { useLocalStorage } from '@uidotdev/usehooks';
import { ScoreRecord } from './types';

export default function useLeaderboard() {
  const [leaderboard, setLeaderboard] = useLocalStorage<
    Omit<ScoreRecord, 'rank'>[]
  >('t3d-leaderboard', []);

  const saveNew = (score: ScoreRecord) => {
    const updated = [...leaderboard, score];
    setLeaderboard(updated);
  };

  const sorted = leaderboard
    .sort((a, b) => b.score - a.score)
    .map((e, i) => ({ rank: i + 1, ...e }));

  return [sorted, saveNew] as const;
}
