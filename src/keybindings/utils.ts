import {
  GamepadKeybindings,
  defaultGamepadKeybindings,
  defaultKeyboardKeybindings,
  KeyboardKeybindings,
} from './keybinding';

export function readControllerKeybindings(): GamepadKeybindings {
  const storedControllerKeybindings = window.localStorage.getItem(
    'controller-keybindings',
  );
  if (!storedControllerKeybindings) {
    window.localStorage.setItem(
      'controller-keybindings',
      JSON.stringify(defaultGamepadKeybindings),
    );
    return defaultGamepadKeybindings;
  }
  try {
    return JSON.parse(storedControllerKeybindings);
  } catch (error) {
    console.error('Error parsing controller config:', error);
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

export function resetControllerKeybindings() {
  window.localStorage.setItem(
    'controller-keybindings',
    JSON.stringify(defaultGamepadKeybindings),
  );
}

export function resetKeyboardKeybindings() {
  window.localStorage.setItem(
    'keyboard-keybindings',
    JSON.stringify(defaultKeyboardKeybindings),
  );
}
