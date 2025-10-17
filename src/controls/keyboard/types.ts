export type KeyboardHandler = (
  event: 'press' | 'release',
  button: KeyboardEvent['code'],
) => void;
