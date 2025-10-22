import { match } from 'ts-pattern';
import { SemanticButton } from '~/keybindings/keybinding';

export default function localizeSemanticButton(button: SemanticButton): string {
  return match(button)
    .with('pause', () => 'pause game')
    .with('shiftL', () => 'move piece left')
    .with('shiftR', () => 'move piece right')
    .with('shiftF', () => 'move piece forward')
    .with('shiftB', () => 'move piece backward')
    .with('rotateL', () => 'rotate piece right')
    .with('rotateR', () => 'rotate piece left')
    .with('hold', () => 'hold piece')
    .with('cameraL', () => 'move camera left')
    .with('cameraR', () => 'move camera right')
    .with('cutL', () => 'hide left side')
    .with('cutR', () => 'hide right side')
    .with('drop', () => 'soft drop / hard drop')
    .exhaustive();
}
