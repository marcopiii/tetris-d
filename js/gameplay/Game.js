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

    /** Progresses the game by one tick.
     * @return {[number, boolean]} - A tuple containing the number of cleared lines and whether the game is over
     */
    tick() {
        this._board.clearLines()
        this._piece.drop();
        if (detectCollision(this._piece, this._board)) {
            this._piece.rollback();
            this._board.fixPiece(this._piece);
            const lineClear = this._board.checkLines();
            this._piece = this._piece.plane === "x"
                ? new Piece("z")
                : new Piece("x");
            const gameOver = detectCollision(this._piece, this._board);
            return [lineClear, gameOver];
        }
        return [0, false];
    }

    #hardDrop() {
        while (!detectCollision(this._piece, this._board)) {
            this._piece.drop();
        }
        this._piece.rollback();
        this._board.fixPiece(this._piece);
        // fix the piece to avoid further moving
        // this will cause a collision since we don't spawn a new piece here
    }

    tryMove(type: "shiftL" | "shiftR" | "shiftB" | "shiftF" | "rotateL" | "rotateR" | "hardDrop"): boolean {
        let wallKickTest = 0;
        switch (type) {
            case "shiftL":
                this._piece.shiftLeft();
                break; // go to collision detection
            case "shiftR":
                this._piece.shiftRight();
                break; // go to collision detection
            case "shiftB":
                this._piece.shiftBackward();
                break; // go to collision detection
            case "shiftF":
                this._piece.shiftForward();
                break; // go to collision detection
            case "rotateL":
                while (wallKickTest < 5) {
                    this._piece.rotateLeft(wallKickTest);
                    if (!detectCollision(this._piece, this._board))
                        return true;
                    this._piece.rollback();
                    wallKickTest++;
                }
                return false;
            case "rotateR":
                while (wallKickTest < 5) {
                    this._piece.rotateRight(wallKickTest);
                    if (!detectCollision(this._piece, this._board))
                        return true;
                    this._piece.rollback();
                    wallKickTest++;
                }
                return false;
            case "hardDrop":
                this.#hardDrop();
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
        const stackCollision = !(floorCollision || wallCollision) && board.blockAt(y, x, z) !== null;
        if (floorCollision || wallCollision || stackCollision) {
            collisionDetected = true;
        }
    })
    return collisionDetected;
}