import { Tetrimino } from '~/tetrimino';

const tetrimino: Record<Tetrimino, string> = {
  I: '#FFB3BA',
  O: '#FFDFBA',
  T: '#FFFFBA',
  J: '#BAFFC9',
  L: '#BAE1FF',
  S: '#D4BAFF',
  Z: '#FFBADD',
};

const text = {
  primary: '#F39E60',
  secondary: '#78ABA8',
  main: '#E16A54',
};

export const colors = {
  tetrimino: tetrimino,
  text: text,
  disabled: '#cfcfcf',
  tetrion: '#8797a4',
};
