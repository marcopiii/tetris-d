import { match } from 'ts-pattern';
import { GamepadButton } from './types';

export function mapping(i: number): GamepadButton | undefined {
  return match(i)
    .with(0, () => 'A' as const)
    .with(1, () => 'B' as const)
    .with(2, () => 'X' as const)
    .with(3, () => 'Y' as const)
    .with(4, () => 'LB' as const)
    .with(5, () => 'RB' as const)
    .with(6, () => 'LT' as const)
    .with(7, () => 'RT' as const)
    .with(8, () => 'select' as const)
    .with(9, () => 'start' as const)
    .with(12, () => 'padU' as const)
    .with(13, () => 'padD' as const)
    .with(14, () => 'padL' as const)
    .with(15, () => 'padR' as const)
    .otherwise(() => undefined);
}
