import { colors } from '~/materials/colors';
import { MINO_SIZE } from '~/scene/shared';

type Font = 'alphabet' | 'numbers';

type TextStyle = {
  size: number;
  color: string;
  font: Font;
};

type Text =
  | 'main'
  | 'menu'
  | 'menuSelected'
  | 'hudLabel'
  | 'hudScore'
  | 'hudFeedback';

export const textStyle: Record<Text, TextStyle> = {
  main: {
    size: 0.3 * MINO_SIZE,
    font: 'alphabet',
    color: colors.text.main,
  },
  menu: {
    size: 0.15 * MINO_SIZE,
    font: 'alphabet',
    color: colors.text.secondary,
  },
  menuSelected: {
    size: 0.25 * MINO_SIZE,
    font: 'alphabet',
    color: colors.text.primary,
  },
  hudLabel: {
    size: 0.15 * MINO_SIZE,
    font: 'alphabet',
    color: colors.text.secondary,
  },
  hudScore: {
    size: 0.25 * MINO_SIZE,
    font: 'numbers',
    color: colors.text.secondary,
  },
  hudFeedback: {
    size: 0.15 * MINO_SIZE,
    font: 'alphabet',
    color: colors.text.main,
  },
};
