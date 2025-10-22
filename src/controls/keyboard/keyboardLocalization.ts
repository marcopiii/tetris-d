import { match } from 'ts-pattern';

export default function keyboardLocalization(
  button: KeyboardEvent['code'],
): string {
  return match(button)
    .with('Enter', () => 'enter')
    .with('KeyA', () => 'A')
    .with('KeyD', () => 'D')
    .with('KeyS', () => 'S')
    .with('KeyW', () => 'W')
    .with('KeyQ', () => 'Q')
    .with('KeyE', () => 'E')
    .with('KeyX', () => 'X')
    .with('ArrowLeft', () => 'left')
    .with('ArrowRight', () => 'right')
    .with('ArrowDown', () => 'down')
    .with('ArrowUp', () => 'up')
    .with('Space', () => 'space')
    .otherwise(() => button);
}
