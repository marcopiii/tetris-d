import {
  GamepadKeybindings,
  KeyboardKeybindings,
  SemanticButton,
} from '~/keybindings/keybinding';
import t from './localizeSemanticButton';

export const getControlsOptions =
  (cb: {
    onSelect: (_: SemanticButton) => void;
    onReset: () => void;
    onBack: () => void;
  }) =>
  (
    gamepadKeybindings: GamepadKeybindings,
    keyboardKeybindings: KeyboardKeybindings,
  ) => {
    const build = buildOption(cb.onSelect)(
      gamepadKeybindings,
      keyboardKeybindings,
    );

    const semanticButtons: SemanticButton[] = [
      'pause',
      'shiftL',
      'shiftR',
      'shiftF',
      'shiftB',
      'rotateL',
      'rotateR',
      'hold',
      'cameraL',
      'cameraR',
      'cutL',
      'cutR',
      'drop',
    ];

    return [
      ...semanticButtons.map(build),
      {
        name: 'reset',
        action: cb.onReset,
      },
      {
        name: 'back',
        action: cb.onBack,
        terminal: true,
      },
    ];
  };

const buildOption =
  (onSelect: (_: SemanticButton) => void) =>
  (
    gamepadKeybindings: GamepadKeybindings,
    keyboardKeybindings: KeyboardKeybindings,
  ) =>
  (semanticButton: SemanticButton) => ({
    name: t(semanticButton),
    accessory: {
      semanticButton: semanticButton,
      gamepad: gamepadKeybindings[semanticButton],
      keyboard: keyboardKeybindings[semanticButton],
    },
    action: () => onSelect(semanticButton),
  });
