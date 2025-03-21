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
            const blockY = this._piece.position.y + y;
            const blockX = this._piece.position.x + x;
            const blockZ = this._piece.position.z + z;
            if (blockY >= ROWS
                || blockX + x < 0
                || blockX + x >= COLS
                || blockZ + z < 0
                || blockZ + z >= COLS
                || this._board.blockAt(blockY, blockX, blockZ) !== null) {
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
            // todo: check rows
            this._piece = new Piece();
            if (this.#detectCollision()) {
                return true;
            }
        }
        return false;
    }


}