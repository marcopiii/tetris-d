import { Name as Tetrimino } from './tetrimino';

const tetrimino: Record<Tetrimino, string> = {
  I: '#FFB3BA',
  O: '#FFDFBA',
  T: '#FFFFBA',
  J: '#BAFFC9',
  L: '#BAE1FF',
  S: '#D4BAFF',
  Z: '#FFBADD',
};

export const colors = {
  tetrimino: tetrimino,
};
