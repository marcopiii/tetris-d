import { useLocalStorage } from '@uidotdev/usehooks';
import { ScoreRecord } from './types';

export default function useLeaderboard() {
  const [leaderboard, setLeaderboard] = useLocalStorage<
    Omit<ScoreRecord, 'rank'>[]
  >('t3d-leaderboard', []);

  const saveNew = (record: ScoreRecord) => {
    const { score, level, name } = record;
    const pureRecord = { score, level, name };
    const updated = [...leaderboard, pureRecord];
    setLeaderboard(updated);
  };

  const sorted = leaderboard
    .sort((a, b) => b.score - a.score)
    .map((e, i) => ({ rank: i + 1, ...e }));

  return [sorted, saveNew] as const;
}
