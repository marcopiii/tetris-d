import { tetrimino } from '../../tetrimino';
import { play } from '../../utils';
import { Bag } from './Bag';
import { GameCamera } from './GameCamera';
import { Board } from './Board';
import { Piece } from './Piece';
import { COLS, ROWS } from '../../params';
import { Hold } from './Hold';
import { GameplayCommand } from './commands';
import { LineCoord } from './types';

const tetrimino_move_fx = require('../../audio/tetrimino_move.mp3');
const tetrimino_rotate_fx = require('../../audio/tetrimino_rotate.mp3');
const hard_drop_fx = require('../../audio/hard_drop.mp3');
const line_clear_fx = require('../../audio/line_clear.mp3');

export class Game {
  private readonly _onNewPiece: () => void;
  private readonly _board: Board;
  private readonly _bag: Bag;
  private _piece: Piece;
  private _hold: Hold;

  constructor(onNewPiece: () => void) {
    this._onNewPiece = onNewPiece;
    this._board = new Board();
    this._bag = new Bag();
    this._hold = new Hold(this._bag.getNextTetrimino());
    this._piece = new Piece(this._bag.getNextTetrimino(), 'z');
  }

  get board() {
    return this._board;
  }

  get piece() {
    return this._piece;
  }

  get next() {
    const type = this._bag.previewNextTetrimino();
    return { type: type, shape: tetrimino[type] };
  }

  get held() {
    return { ...this._hold.piece, available: this._piece.isHoldable };
  }

  /** Progresses the game by one tick.
   * @return A tuple containing the cleared lines and whether the game is over
   */
  tick(): [LineCoord[], boolean] {
    const needRecheck = this._board.clearLines();
    const cascadeLineClear = needRecheck
      ? this._board.checkLines()
      : [];
    if (cascadeLineClear.length > 0) {
      play(line_clear_fx, 0.75);
    }
    this._piece.drop();
    if (detectCollision(this._piece, this._board)) {
      this._piece.rollback();
      this._board.fixPiece(this._piece);
      const lineClear = this._board.checkLines();
      if (lineClear.length > 0) {
        play(line_clear_fx, 0.75);
      }
      this._piece =
        this._piece.plane === 'x'
          ? new Piece(this._bag.getNextTetrimino(), 'z')
          : new Piece(this._bag.getNextTetrimino(), 'x');
      this._onNewPiece();
      const gameOver = detectCollision(this._piece, this._board);
      return [
        [...lineClear, ...cascadeLineClear],
        gameOver,
      ];
    }
    return [cascadeLineClear, false];
  }

  private holdPiece() {
    if (!this._piece.isHoldable) return;
    const hold = this._hold.replace(this._piece);
    this._piece.replace(hold);
  }

  private hardDrop() {
    while (!detectCollision(this._piece, this._board)) {
      this._piece.drop();
    }
    this._piece.rollback();
  }

  /**
   * @returns {boolean} - Whether the move had success
   */
  tryMove(type: GameplayCommand, camera: GameCamera): boolean {
    const isInverted =
      (this._piece.plane === 'x' &&
        camera.relativeDirection.z === 'negative') ||
      (this._piece.plane === 'z' && camera.relativeDirection.x === 'negative');

    let wallKickTest = 0;
    switch (type) {
      case 'shiftL':
        isInverted ? this._piece.shiftRight() : this._piece.shiftLeft();
        break; // go to collision detection
      case 'shiftR':
        isInverted ? this._piece.shiftLeft() : this._piece.shiftRight();
        break; // go to collision detection
      case 'shiftB':
        isInverted ? this._piece.shiftForward() : this._piece.shiftBackward();
        break; // go to collision detection
      case 'shiftF':
        isInverted ? this._piece.shiftBackward() : this._piece.shiftForward();
        break; // go to collision detection
      case 'rotateL':
        while (wallKickTest < 5) {
          isInverted
            ? this._piece.rotateRight(wallKickTest)
            : this._piece.rotateLeft(wallKickTest);
          if (!detectCollision(this._piece, this._board)) {
            play(tetrimino_rotate_fx, 0.15);
            return true;
          }
          this._piece.rollback();
          wallKickTest++;
        }
        return false;
      case 'rotateR':
        while (wallKickTest < 5) {
          isInverted
            ? this._piece.rotateLeft(wallKickTest)
            : this._piece.rotateRight(wallKickTest);
          if (!detectCollision(this._piece, this._board)) {
            play(tetrimino_rotate_fx, 0.15);
            return true;
          }
          this._piece.rollback();
          wallKickTest++;
        }
        return false;
      case 'hardDrop':
        this.hardDrop();
        play(hard_drop_fx, 0.5);
        return true;
      case 'hold':
        this.holdPiece();
        return true;
    }
    if (detectCollision(this._piece, this._board)) {
      this._piece.rollback();
      return false;
    }
    play(tetrimino_move_fx, 0.15);
    return true;
  }

  get ghostPiece() {
    const ghost = this._piece.clone();
    while (!detectCollision(ghost, this._board)) {
      ghost.drop();
    }
    ghost.rollback();
    return ghost;
  }
}

function detectCollision(piece: Piece, board: Board): boolean {
  let collisionDetected = false;
  piece.forEachBlock((y, x, z) => {
    const floorCollision = y >= ROWS;
    const wallCollision = x < 0 || x >= COLS || z < 0 || z >= COLS;
    // avoid calling .blockAt() if one of the index is out of bounds
    const stackCollision =
      !(floorCollision || wallCollision) && board.blockAt(y, x, z) !== null;
    if (floorCollision || wallCollision || stackCollision) {
      collisionDetected = true;
    }
  });
  return collisionDetected;
}
