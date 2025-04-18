import { GameCameraPosition } from './GameCamera';
import { Board } from './Board';
import { Piece } from './Piece';
import { COLS, ROWS } from '../../params';
import { Hold } from './Hold';
import { GameplayCommand } from './commands';

export class Game {
  private readonly _onNewPiece: () => void;
  private readonly _board: Board;
  private _piece: Piece;
  private _hold: Hold;

  constructor(onNewPiece: () => void) {
    this._onNewPiece = onNewPiece;
    this._board = new Board();
    this._piece = new Piece();
    this._hold = new Hold();
  }

  get board() {
    return this._board;
  }

  get piece() {
    return this._piece;
  }

  get held() {
    return { ...this._hold.piece, available: this._piece.isHoldable };
  }

  /** Progresses the game by one tick.
   * @return A tuple containing the number of cleared lines for each side and whether the game is over
   */
  tick(): [number, number, boolean] {
    this._board.clearLines();
    this._piece.drop();
    if (detectCollision(this._piece, this._board)) {
      this._piece.rollback();
      this._board.fixPiece(this._piece);
      const [lineClearZ, lineClearX] = this._board.checkLines();
      this._piece = this._piece.plane === 'x' ? new Piece('z') : new Piece('x');
      this._onNewPiece();
      const gameOver = detectCollision(this._piece, this._board);
      return [lineClearZ, lineClearX, gameOver];
    }
    return [0, 0, false];
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
  tryMove(type: GameplayCommand, cameraPosition: GameCameraPosition): boolean {
    const isInverted =
      (this._piece.plane === 'x' &&
        relativeDirection[cameraPosition].z === 'negative') ||
      (this._piece.plane === 'z' &&
        relativeDirection[cameraPosition].x === 'negative');

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
          if (!detectCollision(this._piece, this._board)) return true;
          this._piece.rollback();
          wallKickTest++;
        }
        return false;
      case 'rotateR':
        while (wallKickTest < 5) {
          isInverted
            ? this._piece.rotateLeft(wallKickTest)
            : this._piece.rotateRight(wallKickTest);
          if (!detectCollision(this._piece, this._board)) return true;
          this._piece.rollback();
          wallKickTest++;
        }
        return false;
      case 'hardDrop':
        this.hardDrop();
        return true;
      case 'hold':
        this.holdPiece();
        return true;
    }
    if (detectCollision(this._piece, this._board)) {
      this._piece.rollback();
      return false;
    }
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

type RelativeDirection = {
  x: 'positive' | 'negative';
  z: 'positive' | 'negative';
};

const relativeDirection: Record<GameCameraPosition, RelativeDirection> = {
  c1: {
    x: 'positive',
    z: 'positive',
  },
  c2: {
    x: 'positive',
    z: 'negative',
  },
  c3: {
    x: 'negative',
    z: 'negative',
  },
  c4: {
    x: 'negative',
    z: 'positive',
  },
};
