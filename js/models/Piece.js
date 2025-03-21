import {COLS} from "../params.js";
import {generateRandomPiece} from "../pieces/generateRandomPiece.js";
import {copy} from "../utils";

export class Piece {
  constructor() {
    const {shape, color} = generateRandomPiece()
    this._shape = shape;
    this._position = {
      x: Math.floor(COLS / 2) - 1,
      y: 0
    };
    this._color = color;
    this._prev = {
      position: this._position,
      shape: this._shape
    }
  }

  get shape() {
    return this._shape;
  }

  get position() {
    return this._position;
  }

  get color() {
    return this._color;
  }

  #checkpoint() {
    this._prev = {
      position: copy(this._position),
      shape: copy(this._shape)
    }
  }

  rollback() {
    this._position = copy(this._prev.position);
    this._shape = copy(this._prev.shape);
  }

  shiftLeft() {
    this.#checkpoint();
    this._position.x--;
  }

  shiftRight() {
    this.#checkpoint();
    this._position.x++;
  }

  rotateRight() {
    this.#checkpoint();
    this._shape = this._shape[0]
      .map((_, index) =>
        this._shape.map(row => row[index])
      )
      .reverse();
  }

  rotateLeft() {
    this.#checkpoint();
    this._shape = this._shape
      .map((row, index) =>
        row.map((_, colIndex) => this._shape[colIndex][index])
      )
      .reverse();
  }

  drop() {
    this.#checkpoint();
    this._position.y++;
  }

}
