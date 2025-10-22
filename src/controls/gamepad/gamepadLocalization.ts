import { match } from 'ts-pattern';
import type { Button } from './types';

export default function gamepadLocalization(button: Button): string {
  return match(button)
    .with('A', () => 'A')
    .with('B', () => 'B')
    .with('X', () => 'X')
    .with('Y', () => 'Y')
    .with('LB', () => 'LB')
    .with('RB', () => 'RB')
    .with('LT', () => 'LT')
    .with('RT', () => 'RT')
    .with('select', () => 'select')
    .with('start', () => 'start')
    .with('padU', () => 'up')
    .with('padD', () => 'down')
    .with('padL', () => 'left')
    .with('padR', () => 'right')
    .exhaustive();
}
