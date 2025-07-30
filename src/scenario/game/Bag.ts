import { Name as Tetrimino, tetriminos } from '../../tetrimino';

export class Bag {
  private bag!: Tetrimino[];

  constructor() {
    this.regenBag();
  }

  private regenBag() {
    const tetriminos = Object.keys(tetriminos) as Tetrimino[];
    for (let i = tetriminos.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [tetriminos[i], tetriminos[j]] = [tetriminos[j], tetriminos[i]];
    }
    this.bag = tetriminos;
  }

  getNextTetrimino() {
    if (this.bag.length === 0) {
      this.regenBag();
    }
    return this.bag.pop()!;
  }

  previewNextTetrimino() {
    if (this.bag.length === 0) {
      this.regenBag();
    }
    return this.bag[this.bag.length - 1];
  }
}
