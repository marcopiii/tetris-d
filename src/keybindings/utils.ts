import {
  ControllerKeybindings,
  defaultControllerKeybindings,
  defaultKeyboardKeybindings,
  KeyboardKeybindings,
} from './keybinding';

export function readControllerKeybindings(): ControllerKeybindings {
  const storedControllerKeybindings = window.localStorage.getItem(
    'controller-keybindings',
  );
  if (!storedControllerKeybindings) {
    window.localStorage.setItem(
      'controller-keybindings',
      JSON.stringify(defaultControllerKeybindings),
    );
    return defaultControllerKeybindings;
  }
  try {
    return JSON.parse(storedControllerKeybindings);
  } catch (error) {
    console.error('Error parsing controller config:', error);
    return defaultControllerKeybindings;
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
