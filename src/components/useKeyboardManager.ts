type KeyboardHandler = (
  event: 'press' | 'release',
  button: KeyboardEvent['code'],
) => void;

import React from 'react';

export function useKeyboardManager(handler: KeyboardHandler): void {
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) =>
      !event.repeat && handler('press', event.code);
    const handleKeyUp = (event: KeyboardEvent) =>
      !event.repeat && handler('release', event.code);

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handler]);
}
