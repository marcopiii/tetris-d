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
     * @return {[number, boolean]} - A tuple containing the number of cleared lines and whether the game is over
     */
    tick() {
        this._board.clearLines()
        this._piece.drop();
        if (this.#detectCollision()) {
            this._piece.rollback();
            this._board.fixPiece(this._piece);
            const lineClear = this._board.checkLines();
            this._piece = this._piece.plane === "x"
                ? new Piece("z")
                : new Piece("x");
            const gameOver = this.#detectCollision();
            return [lineClear, gameOver];
        }
        return [0, false];
    }

    #hardDrop() {
        while (!this.#detectCollision()) {
            this._piece.drop();
        }
        this._piece.rollback();
        this._board.fixPiece(this._piece);
        // fix the piece to avoid further moving
        // this will cause a collision since we don't spawn a new piece here
    }

    tryMove(type: "shiftL" | "shiftR" | "shiftB" | "shiftF" | "rotateL" | "rotateR" | "hardDrop"): boolean {
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
            case "hardDrop":
                this.#hardDrop();
                // escape the collision detection
                return true;
        }
        if (this.#detectCollision()) {
            this._piece.rollback();
            return false;
        }
        return true;
    }


}