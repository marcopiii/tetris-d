import {tetrimino} from "./tetrimino.js";

export function generateRandomPiece() {
  const keys = Object.keys(tetrimino);
  const randomKey = keys[Math.floor(Math.random() * keys.length)];
  return { type: randomKey, ...tetrimino[randomKey]};
}
