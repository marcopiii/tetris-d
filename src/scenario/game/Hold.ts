import { Shape, Name as Tetrimino, tetriminos } from '../../tetrimino';
import type { Piece } from './Piece';

export class Hold {
  private _type: Tetrimino;
  private _shape: Shape;

  constructor(type: Tetrimino) {
    this._type = type;
    this._shape = tetriminos[type];
  }

  get piece() {
    return {
      type: this._type,
      shape: this._shape,
    };
  }

  replace(piece: Piece) {
    const hold = {
      type: this._type,
      shape: this._shape,
    };
    this._type = piece.type;
    this._shape = piece.shape;
    return hold;
  }
}
