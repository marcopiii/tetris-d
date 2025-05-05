import { Button } from './GamepadManager';

export function buttonLocalization(button: Button): string {
  switch (button) {
    case 'A':
      return 'A';
    case 'B':
      return 'B';
    case 'X':
      return 'X';
    case 'Y':
      return 'Y';
    case 'LB':
      return 'LB';
    case 'RB':
      return 'RB';
    case 'LT':
      return 'LT';
    case 'RT':
      return 'RT';
    case 'select':
      return 'select';
    case 'start':
      return 'start';
    case 'padU':
      return 'up';
    case 'padD':
      return 'down';
    case 'padL':
      return 'left';
    case 'padR':
      return 'right';
    default:
      return button;
  }
}
