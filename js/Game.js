import {Piece} from "./Piece";
import {Board} from "./Board";
import {detectCollision} from "./detectCollision";

export class Game {
  constructor() {
    this._boards = Array(3).fill().map(() => new Board());
    this._activeBoardIndex = 0;
    this._currentPiece = new Piece();
  }

  get boards() {
    return this._boards;
  }

  get activeBoard(): Board {
    return this._boards[this._activeBoardIndex];
  }

  get activeBoardIndex() {
    return this._activeBoardIndex;
  }

  jumpBoardRight() {
    this._activeBoardIndex = (this._activeBoardIndex + 1) % 3;
  }

  jumpBoardLeft() {
    this._activeBoardIndex = (this._activeBoardIndex + 2) % 3;
  }

  get currentPiece() {
    return this._currentPiece;
  }

  set currentPiece(piece: Piece) {
    this._currentPiece = piece;
  }

  reset() {
    this._boards.forEach(board => board.clean());
    this._currentPiece = new Piece();
    this._activeBoardIndex = 0;
  }

  /** Progresses the game by one tick.
   * @return {boolean} - Whether the game is over
   */
  tick() {
    this.currentPiece.drop()
    if (detectCollision(this.activeBoard, this.currentPiece)) {
      this.currentPiece.rollback();
      this.activeBoard.fixPiece(this.currentPiece);
      this.activeBoard.checkRows();
      this.currentPiece = new Piece();
      if (detectCollision(this.activeBoard, this.currentPiece)) {
        return true;
      }
    }
    return false;
  }

}