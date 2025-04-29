import { Name as Tetrimino, tetrimino } from '../../tetrimino';

export class Bag {

  private bag!: Tetrimino[];

  constructor() {
    this.regenBag();
  }

  private regenBag() {
    const tetriminos = Object.keys(tetrimino) as Tetrimino[]
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
    const next = this.bag.pop()!;
    return {
      type: next,
      shape: tetrimino[next]
    }
  }

  previewNextTetrimino() {
    if (this.bag.length === 0) {
      this.regenBag();
    }
    const next = this.bag[this.bag.length - 1];
    return {
      type: next,
      shape: tetrimino[next]
    }
  }


}