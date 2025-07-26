type KeyboardHandler = (
  event: 'press' | 'release',
  button: KeyboardEvent['code'],
) => void;

export function useKeyboardManager(handler: KeyboardHandler): void {
  const handleKeyDown = (event: KeyboardEvent) => {
    handler('press', event.code);
  };
  const handleKeyUp = (event: KeyboardEvent) => {
    handler('release', event.code);
  };

  window.addEventListener('keydown', handleKeyDown);
  window.addEventListener('keyup', handleKeyUp);
}
