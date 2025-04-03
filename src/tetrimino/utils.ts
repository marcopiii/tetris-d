import {tetrimino} from "./tetrimino";

export function getRandomTetrimino() {
  const keys = Object.keys(tetrimino) as (keyof typeof tetrimino)[];
  const randomKey = keys[Math.floor(Math.random() * keys.length)];
  return { type: randomKey, shape: tetrimino[randomKey] };
}
