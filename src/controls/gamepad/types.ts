export type GamepadButton =
  | 'start'
  | 'select'
  | 'padL'
  | 'padD'
  | 'padR'
  | 'padU'
  | 'A'
  | 'B'
  | 'X'
  | 'Y'
  | 'LB'
  | 'RB'
  | 'LT'
  | 'RT';

export type GamepadButtonEvent = 'press' | 'hold' | 'release' | 'lift';

export type GamepadStick = 'left' | 'right';

/**
 * @param x - The x-axis value, ranging from -1 (left) to 1 (right), with 2 decimal digits.
 * @param y - The y-axis value, ranging from -1 (up) to 1 (down), with 2 decimal digits.
 */
export type GamepadStickStatus = { x: number; y: number };
