import { colors } from '~/materials/colors';
import { MINO_SIZE } from '~/scene/shared';

type Style = {
  size: number;
  color: keyof (typeof colors)['text'];
  font: 'alphabet' | 'numbers';
};

export type Text =
  | 'main'
  | 'menu'
  | 'menuSelected'
  | 'hudLabel'
  | 'hudScore'
  | 'hudFeedback'
  | 'scoreboardHeader'
  | 'scoreboardEntry'
  | 'scoreboardEntrySelected';

export const textStyleConfig: Record<Text, Style> = {
  main: {
    size: 0.3 * MINO_SIZE,
    font: 'alphabet',
    color: 'main',
  },
  menu: {
    size: 0.15 * MINO_SIZE,
    font: 'alphabet',
    color: 'secondary',
  },
  menuSelected: {
    size: 0.25 * MINO_SIZE,
    font: 'alphabet',
    color: 'primary',
  },
  hudLabel: {
    size: 0.15 * MINO_SIZE,
    font: 'alphabet',
    color: 'secondary',
  },
  hudScore: {
    size: 0.25 * MINO_SIZE,
    font: 'numbers',
    color: 'secondary',
  },
  hudFeedback: {
    size: 0.15 * MINO_SIZE,
    font: 'alphabet',
    color: 'main',
  },
  scoreboardHeader: {
    size: 0.2 * MINO_SIZE,
    font: 'alphabet',
    color: 'primary',
  },
  scoreboardEntry: {
    size: 0.15 * MINO_SIZE,
    font: 'alphabet',
    color: 'secondary',
  },
  scoreboardEntrySelected: {
    size: 0.15 * MINO_SIZE,
    font: 'alphabet',
    color: 'primary',
  },
};
