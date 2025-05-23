import { tetrimino } from '../../tetrimino';
import { play } from '../../utils';
import { Bag } from './Bag';
import { GameCamera } from './GameCamera';
import { Board } from './Board';
import { Piece } from './Piece';
import { COLS, ROWS } from '../../params';
import { Hold } from './Hold';
import { GameplayAction } from './actions';
import { LineCoord } from './types';

import FX from '../../audio';

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
    const cascadeLineClear = needRecheck ? this._board.checkLines() : [];
    if (cascadeLineClear.length > 0) {
      play(FX.line_clear, 0.75);
      return [cascadeLineClear, false];
    }
    this._piece.drop();
    if (detectCollision(this._piece, this._board)) {
      this._piece.rollback();
      this._board.fixPiece(this._piece);
      const lineClear = this._board.checkLines();
      if (lineClear.length > 0) {
        play(FX.line_clear, 0.75);
      }
      this._piece =
        this._piece.plane === 'x'
          ? new Piece(this._bag.getNextTetrimino(), 'z')
          : new Piece(this._bag.getNextTetrimino(), 'x');
      this._onNewPiece();
      const gameOver = detectCollision(this._piece, this._board);
      return [lineClear, gameOver];
    }
    return [[], false];
  }

  /**
   * @returns {[boolean, boolean]} - Whether the move had success and whether
   * the move should cause the clock to reset
   */
  tryMove(type: GameplayAction, camera: GameCamera): [boolean, boolean] {
    const isInverted =
      (this._piece.plane === 'x' &&
        camera.relativeDirection.z === 'negative') ||
      (this._piece.plane === 'z' && camera.relativeDirection.x === 'negative');

    const lockTest = (): boolean => {
      this._piece.drop();
      const isGoingToLock = detectCollision(this._piece, this._board);
      this._piece.rollback();
      return isGoingToLock;
    };

    const tryShift = (
      type: 'shiftL' | 'shiftR' | 'shiftB' | 'shiftF',
    ): [boolean, boolean] => {
      switch (type) {
        case 'shiftL':
          isInverted ? this._piece.shiftRight() : this._piece.shiftLeft();
          break;
        case 'shiftR':
          isInverted ? this._piece.shiftLeft() : this._piece.shiftRight();
          break;
        case 'shiftB':
          isInverted ? this._piece.shiftForward() : this._piece.shiftBackward();
          break;
        case 'shiftF':
          isInverted ? this._piece.shiftBackward() : this._piece.shiftForward();
          break;
      }
      if (detectCollision(this._piece, this._board)) {
        this._piece.rollback();
        return [false, false];
      }
      play(FX.tetrimino_move, 0.15);
      const clockReset = lockTest();
      return [true, clockReset];
    };

    const tryRotation = (type: 'rotateL' | 'rotateR'): [boolean, boolean] => {
      let wallKickTest = 0;
      switch (type) {
        case 'rotateL':
          while (wallKickTest < 5) {
            isInverted
              ? this._piece.rotateRight(wallKickTest)
              : this._piece.rotateLeft(wallKickTest);
            if (!detectCollision(this._piece, this._board)) {
              play(FX.tetrimino_rotate, 0.15);
              const clockReset = lockTest();
              return [true, clockReset];
            }
            this._piece.rollback();
            wallKickTest++;
          }
          return [false, false];
        case 'rotateR':
          while (wallKickTest < 5) {
            isInverted
              ? this._piece.rotateLeft(wallKickTest)
              : this._piece.rotateRight(wallKickTest);
            if (!detectCollision(this._piece, this._board)) {
              play(FX.tetrimino_rotate, 0.15);
              const clockReset = lockTest();
              return [true, clockReset];
            }
            this._piece.rollback();
            wallKickTest++;
          }
          return [false, false];
      }
    };

    const hardDrop = (): [boolean, boolean] => {
      while (!detectCollision(this._piece, this._board)) {
        this._piece.drop();
      }
      this._piece.rollback();
      play(FX.hard_drop, 0.5);
      return [true, true];
    };

    const holdPiece = (): [boolean, boolean] => {
      if (!this._piece.isHoldable) return [false, false];
      const hold = this._hold.replace(this._piece);
      this._piece.replace(hold);
      return [true, true];
    };

    switch (type) {
      case 'shiftL':
      case 'shiftR':
      case 'shiftB':
      case 'shiftF':
        return tryShift(type);
      case 'rotateL':
      case 'rotateR':
        return tryRotation(type);
      case 'hardDrop':
        return hardDrop();
      case 'hold':
        return holdPiece();
    }
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
