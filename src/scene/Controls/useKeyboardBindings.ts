import { KeyboardKeybindings, SemanticButton } from '~/controls/types';
import { useLocalStorage } from '@uidotdev/usehooks';

export default function useKeyboardBindings() {
  const [keybindings, setKeybindings] = useLocalStorage<KeyboardKeybindings>(
    'keyboard-keybindings',
    defaultKeyboardKeybindings,
  );

  function read(): KeyboardKeybindings {
    return keybindings;
  }

  function update(action: SemanticButton, key: KeyboardEvent['code']) {
    setKeybindings({
      ...keybindings,
      [action]: key,
    });
  }

  function reset() {
    setKeybindings(defaultKeyboardKeybindings);
  }

  return [read, update, reset] as const;
}

const defaultKeyboardKeybindings: KeyboardKeybindings = {
  pause: 'Enter',
  shiftL: 'KeyA',
  shiftR: 'KeyD',
  shiftF: 'KeyS',
  shiftB: 'KeyW',
  rotateL: 'KeyQ',
  rotateR: 'KeyE',
  hold: 'KeyX',
  cameraL: 'ArrowLeft',
  cameraR: 'ArrowRight',
  cutL: 'ArrowDown',
  cutR: 'ArrowUp',
  drop: 'Space',
};
