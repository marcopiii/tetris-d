import { adjustBrightness as adj } from './adjustBrightness';
import { colors } from './colors';
import { TriMaterial } from './types';

const k = 20;

export const textMaterials: Record<
  'main' | 'primary' | 'secondary' | 'disabled',
  TriMaterial
> = {
  primary: [
    { color: colors.text.primary, fog: false },
    { color: adj(colors.text.primary, k), fog: false },
    { color: adj(colors.text.primary, -k), fog: false },
  ],
  secondary: [
    { color: colors.text.secondary, fog: false },
    { color: adj(colors.text.secondary, k), fog: false },
    { color: adj(colors.text.secondary, -k), fog: false },
  ],
  main: [
    { color: colors.text.main, fog: false },
    { color: adj(colors.text.main, k), fog: false },
    { color: adj(colors.text.main, -k), fog: false },
  ],
  disabled: [
    { color: colors.disabled, fog: false },
    { color: adj(colors.disabled, k), fog: false },
    { color: adj(colors.disabled, -k), fog: false },
  ],
};
