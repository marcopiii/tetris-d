import {Board} from "./3DBoard";
import {Piece} from "./3DPiece";
import {COLS, ROWS} from "../params";

export class Game {
    constructor() {
        this._board = new Board();
        this._piece = new Piece();
    }

    get board() {
        return this._board;
    }

    get piece() {
        return this._piece;
    }

    reset() {
        this._board.clean();
        this._piece = new Piece();
    }

    #detectCollision(): boolean {
        let collisionDetected = false;
        this._piece.forEachBlock((y, x, z) => {
            const floorCollision = y >= ROWS;
            const wallCollision = x < 0 || x >= COLS || z < 0 || z >= COLS;
            // avoid calling .blockAt() if one of the index is out of bounds
            const stackCollision = !(floorCollision || wallCollision) && this._board.blockAt(y, x, z) !== null;
            if (floorCollision || wallCollision || stackCollision) {
                collisionDetected = true;
            }
        })
        return collisionDetected;
    }

    /** Progresses the game by one tick.
     * @return {boolean} - Whether the game is over
     */
    tick() {
        this._piece.drop();
        if (this.#detectCollision()) {
            this._piece.rollback();
            this._board.fixPiece(this._piece);
            this._board.checkRows();
            this._piece = this._piece.plane === "x"
                ? new Piece("z")
                : new Piece("x");
            if (this.#detectCollision()) {
                return true;
            }
        }
        return false;
    }

    tryMove(type: "shiftL" | "shiftR" | "shiftB" | "shiftF" | "rotateL" | "rotateR"): boolean {
        switch (type) {
            case "shiftL":
                this._piece.shiftLeft();
                break;
            case "shiftR":
                this._piece.shiftRight();
                break;
            case "shiftB":
                this._piece.shiftBackward();
                break;
            case "shiftF":
                this._piece.shiftForward();
                break;
            case "rotateL":
                this._piece.rotateLeft();
                break;
            case "rotateR":
                this._piece.rotateRight();
                break;
        }
        if (this.#detectCollision()) {
            this._piece.rollback();
            return false;
        }
        return true;
    }


}