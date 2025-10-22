import { GamepadKeybindings, SemanticButton } from '~/controls/types';
import { useLocalStorage } from '@uidotdev/usehooks';

const KEY = 'gamepad-keybindings';

export default function useGamepadKeybindings() {
  const [keybindings, setKeybindings] = useLocalStorage<GamepadKeybindings>(
    KEY,
    defaultGamepadKeybindings,
  );

  function read(): GamepadKeybindings {
    return keybindings;
  }

  function update(action: SemanticButton, btn: GamepadButton) {
    setKeybindings({
      ...keybindings,
      [action]: btn,
    });
  }

  function reset() {
    setKeybindings(defaultGamepadKeybindings);
  }

  return [read, update, reset] as const;
}

const defaultGamepadKeybindings: GamepadKeybindings = {
  pause: 'start',
  shiftL: 'padL',
  shiftR: 'padR',
  shiftF: 'padD',
  shiftB: 'padU',
  rotateL: 'X',
  rotateR: 'B',
  hold: 'Y',
  cameraL: 'LT',
  cameraR: 'RT',
  cutL: 'LB',
  cutR: 'RB',
  drop: 'A',
};
