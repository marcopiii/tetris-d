import { match, P } from 'ts-pattern';
import { Tetrimino } from '~/tetrimino';
import { WallKickData } from './types';

/**
 * @see https://tetris.wiki/Super_Rotation_System#Wall_Kicks
 */
export default function wallKickData(tetrimino: Tetrimino): WallKickData {
  return match(tetrimino)
    .with(
      'I',
      () =>
        [
          {
            initial: '0',
            final: 'R',
            tests: [
              [0, 0],
              [-2, 0],
              [+1, 0],
              [-2, -1],
              [+1, +2],
            ],
          },
          {
            initial: 'R',
            final: '2',
            tests: [
              [0, 0],
              [-1, 0],
              [+2, 0],
              [-1, +2],
              [+2, -1],
            ],
          },
          {
            initial: '2',
            final: 'L',
            tests: [
              [0, 0],
              [+2, 0],
              [-1, 0],
              [+2, +1],
              [-1, -2],
            ],
          },
          {
            initial: 'L',
            final: '0',
            tests: [
              [0, 0],
              [+1, 0],
              [-2, 0],
              [+1, -2],
              [-2, +1],
            ],
          },
          {
            initial: '0',
            final: 'L',
            tests: [
              [0, 0],
              [-1, 0],
              [+2, 0],
              [-1, +2],
              [+2, -1],
            ],
          },
          {
            initial: 'L',
            final: '2',
            tests: [
              [0, 0],
              [-2, 0],
              [+1, 0],
              [-2, -1],
              [+1, +2],
            ],
          },
          {
            initial: '2',
            final: 'R',
            tests: [
              [0, 0],
              [+1, 0],
              [-2, 0],
              [+1, -2],
              [-2, +1],
            ],
          },
          {
            initial: 'R',
            final: '0',
            tests: [
              [0, 0],
              [+2, 0],
              [-1, 0],
              [+2, +1],
              [-1, -2],
            ],
          },
        ] satisfies WallKickData,
    )
    .with(
      P.union('J', 'L', 'S', 'T', 'Z'),
      () =>
        [
          {
            initial: '0',
            final: 'R',
            tests: [
              [0, 0],
              [-1, 0],
              [-1, +1],
              [0, -2],
              [-1, -2],
            ],
          },
          {
            initial: 'R',
            final: '2',
            tests: [
              [0, 0],
              [+1, 0],
              [+1, -1],
              [0, +2],
              [+1, +2],
            ],
          },
          {
            initial: '2',
            final: 'L',
            tests: [
              [0, 0],
              [+1, 0],
              [+1, +1],
              [0, -2],
              [+1, -2],
            ],
          },
          {
            initial: 'L',
            final: '0',
            tests: [
              [0, 0],
              [-1, 0],
              [-1, -1],
              [0, +2],
              [-1, +2],
            ],
          },
          {
            initial: '0',
            final: 'L',
            tests: [
              [0, 0],
              [+1, 0],
              [+1, +1],
              [0, -2],
              [+1, -2],
            ],
          },
          {
            initial: 'L',
            final: '2',
            tests: [
              [0, 0],
              [-1, 0],
              [-1, -1],
              [0, +2],
              [-1, +2],
            ],
          },
          {
            initial: '2',
            final: 'R',
            tests: [
              [0, 0],
              [-1, 0],
              [-1, +1],
              [0, -2],
              [-1, -2],
            ],
          },
          {
            initial: 'R',
            final: '0',
            tests: [
              [0, 0],
              [+1, 0],
              [+1, -1],
              [0, +2],
              [+1, +2],
            ],
          },
        ] satisfies WallKickData,
    )
    .with(
      'O',
      () =>
        [
          {
            initial: '0',
            final: 'R',
            tests: [
              [0, 0],
              [0, 0],
              [0, 0],
              [0, 0],
              [0, 0],
            ],
          },
          {
            initial: 'R',
            final: '2',
            tests: [
              [0, 0],
              [0, 0],
              [0, 0],
              [0, 0],
              [0, 0],
            ],
          },
          {
            initial: '2',
            final: 'L',
            tests: [
              [0, 0],
              [0, 0],
              [0, 0],
              [0, 0],
              [0, 0],
            ],
          },
          {
            initial: 'L',
            final: '0',
            tests: [
              [0, 0],
              [0, 0],
              [0, 0],
              [0, 0],
              [0, 0],
            ],
          },
          {
            initial: '0',
            final: 'L',
            tests: [
              [0, 0],
              [0, 0],
              [0, 0],
              [0, 0],
              [0, 0],
            ],
          },
          {
            initial: 'L',
            final: '2',
            tests: [
              [0, 0],
              [0, 0],
              [0, 0],
              [0, 0],
              [0, 0],
            ],
          },
          {
            initial: '2',
            final: 'R',
            tests: [
              [0, 0],
              [0, 0],
              [0, 0],
              [0, 0],
              [0, 0],
            ],
          },
          {
            initial: 'R',
            final: '0',
            tests: [
              [0, 0],
              [0, 0],
              [0, 0],
              [0, 0],
              [0, 0],
            ],
          },
        ] satisfies WallKickData,
    )
    .exhaustive();
}
