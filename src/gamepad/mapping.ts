import { Button } from './types';

export function mapping(i: number): Button | undefined {
  switch (i) {
    case 0:
      return 'A';
    case 1:
      return 'B';
    case 2:
      return 'X';
    case 3:
      return 'Y';
    case 4:
      return 'LB';
    case 5:
      return 'RB';
    case 6:
      return 'LT';
    case 7:
      return 'RT';
    case 8:
      return 'select';
    case 9:
      return 'start';
    case 12:
      return 'padU';
    case 13:
      return 'padD';
    case 14:
      return 'padL';
    case 15:
      return 'padR';
    default:
      return undefined;
  }
}
