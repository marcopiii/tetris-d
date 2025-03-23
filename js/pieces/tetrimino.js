/**
 * The definitions of the shapes and colors of the tetriminos.
 * The first level is the Y dimension (vertical), the second level is the X dimension (horizontal) and the third level is the Z dimension (horizontal).
 * The "natural" shape is flattened in the Y and X dimensions (meaning that they have size 1 in the Z dimension).
 */
export const tetrimino = {
  I: {
    shape: [
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ],
    color: '#FFB3BA'
  },
  O: {
    shape: [
        [1, 1],
        [1, 1]
    ],
    color: '#FFDFBA'
  },
  T: {
    shape: [
        [0, 1, 0],
        [1, 1, 1],
        [0, 0, 0]
    ],
    color: '#FFFFBA'
  },
  J: {
    shape: [
        [1, 0, 0],
        [1, 1, 1],
        [0, 0, 0]
    ],
    color: '#BAFFC9'
  },
  L: {
    shape: [
        [0, 0, 1],
        [1, 1, 1],
        [0, 0, 0]
    ],
    color: '#BAE1FF'
  },
  S: {
    shape: [
        [0, 1, 1],
        [1, 1, 0],
        [0, 0, 0]
    ],
    color: '#D4BAFF'
  },
  Z: {
    shape: [
        [1, 1, 0],
        [0, 1, 1],
        [0, 0, 0]
    ],
    color: '#FFBADD'
  },
};
