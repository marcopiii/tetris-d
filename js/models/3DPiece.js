import {COLS} from "../params";
import {generateRandomPiece} from "../pieces/generateRandomPiece";
import {copy} from "../utils";

export class Piece {
    constructor() {
        const {shape, color} = generateRandomPiece()
        this._shape = shape;
        this._position = {
            x: Math.floor(COLS / 2) - 1,
            z: Math.floor(COLS / 2) - 1,
            y: 0
        };
        this._color = color;
        this._prev = {
            position: copy(this._position),
            shape: copy(this._shape)
        };
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

    /**
     * Applies the given callback to each existing block of the piece.
     * @param callback - The callback to apply to each block, given its coordinates in the board.
     */
    forEachBlock(callback: (number, number, number) => void) {
        this._shape.forEach((layer, y) =>
            layer.forEach((xRow, x) =>
                xRow.forEach((exists, z) => {
                    if (!exists) return;
                    callback(
                        this._position.y + y,
                        this._position.x + x,
                        this._position.z + z
                    );
                })
            )
        );
    }

    #checkpoint() {
        this._prev = {
            position: copy(this._position),
            shape: copy(this._shape)
        };
    }

    rollback() {
        this._position = copy(this._prev.position);
        this._shape = copy(this._prev.shape);
    }

    drop() {
        this.#checkpoint();
        this._position.y++;
    }

    shiftRight() {
        this.#checkpoint();
        this._position.z--;
    }

    shiftLeft() {
        this.#checkpoint();
        this._position.z++;
    }

    shiftForward() {
        this.#checkpoint();
        this._position.x--;
    }

    shiftBackward() {
        this.#checkpoint();
        this._position.x++;
    }

}