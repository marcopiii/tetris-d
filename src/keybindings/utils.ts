import { Button as GamepadButton } from '../gamepad';
import {
  GamepadKeybindings,
  defaultGamepadKeybindings,
  defaultKeyboardKeybindings,
  KeyboardKeybindings,
  SemanticButton,
} from './keybinding';

export function readGamepadKeybindings(): GamepadKeybindings {
  const storedGamepadKeybindings = window.localStorage.getItem(
    'gamepad-keybindings',
  );
  if (!storedGamepadKeybindings) {
    window.localStorage.setItem(
      'gamepad-keybindings',
      JSON.stringify(defaultGamepadKeybindings),
    );
    return defaultGamepadKeybindings;
  }
  try {
    return JSON.parse(storedGamepadKeybindings);
  } catch (error) {
    console.error('Error parsing gampad config:', error);
    return defaultGamepadKeybindings;
  }
}

export function readKeyboardKeybindings(): KeyboardKeybindings {
  const storedKeyboardKeybindings = window.localStorage.getItem(
    'keyboard-keybindings',
  );
  if (!storedKeyboardKeybindings) {
    window.localStorage.setItem(
      'keyboard-keybindings',
      JSON.stringify(defaultKeyboardKeybindings),
    );
    return defaultKeyboardKeybindings;
  }
  try {
    return JSON.parse(storedKeyboardKeybindings);
  } catch (error) {
    console.error('Error parsing keyboard config:', error);
    return defaultKeyboardKeybindings;
  }
}

export function updateGamepadKeybindings(
  action: SemanticButton,
  btn: GamepadButton,
) {
  const currentKeybindings = readGamepadKeybindings();
  const newKeybindings = {
    ...currentKeybindings,
    [action]: btn,
  };
  window.localStorage.setItem(
    'gamepad-keybindings',
    JSON.stringify(newKeybindings),
  );
}

export function updateKeyboardKeybindings(
  action: SemanticButton,
  key: KeyboardEvent['code'],
) {
  const currentKeybindings = readKeyboardKeybindings();
  const newKeybindings = {
    ...currentKeybindings,
    [action]: key,
  };
  window.localStorage.setItem(
    'keyboard-keybindings',
    JSON.stringify(newKeybindings),
  );
}
