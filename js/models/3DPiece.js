import {COLS} from "../params";
import {generateRandomPiece} from "../pieces/generateRandomPiece";
import {copy} from "../utils";

export class Piece {
    constructor(plane: "x" | "z" = "z") {
        const {shape, color} = generateRandomPiece()
        this._shape = shape;
        this._position = plane === "x"
            ? {
                x: Math.floor((COLS - 1) / 2),
                z: Math.ceil((COLS - 1 - shape.length) / 2),
                y: 0
            } : {
                x: Math.ceil((COLS - 1 - shape.length) / 2),
                z: Math.floor((COLS - 1) / 2),
                y: 0
            };
        this._plane = plane;
        this._color = color;
        this._prev = {
            position: copy(this._position),
            shape: copy(this._shape),
            plane: copy(this._plane)
        };
    }

    get color() {
        return this._color;
    }

    /**
     * Applies the given callback to each existing block of the piece.
     * @param callback - The callback to apply to each block, given its coordinates in the board.
     */
    forEachBlock(callback: (number, number, number) => void) {
        this._shape.forEach((layer, dy) =>
            layer.forEach((exists, k) => {
                if (!exists) return;
                const dx = this._plane === "x" ? 0 : k;
                const dz = this._plane === "z" ? 0 : k;
                callback(
                    this._position.y + dy,
                    this._position.x + dx,
                    this._position.z + dz
                );
            })
        );
    }

    #checkpoint() {
        this._prev = {
            position: copy(this._position),
            shape: copy(this._shape),
            plane: copy(this._plane)
        };
    }

    rollback() {
        this._position = copy(this._prev.position);
        this._shape = copy(this._prev.shape);
        this._plane = copy(this._prev.plane);
    }

    drop() {
        this.#checkpoint();
        this._position.y++;
    }

    shiftRight() {
        this.#checkpoint();
        switch (this._plane) {
            case "x":
                this._position.z++;
                break;
            case "z":
                this._position.x++;
                break;
        }
    }

    shiftLeft() {
        this.#checkpoint();
        switch (this._plane) {
            case "x":
                this._position.z--;
                break;
            case "z":
                this._position.x--;
                break;
        }
    }

    shiftForward() {
        this.#checkpoint();
        switch (this._plane) {
            case "x":
                this._position.x--;
                break;
            case "z":
                this._position.z++;
                break;
        }
    }

    shiftBackward() {
        this.#checkpoint();
        switch (this._plane) {
            case "x":
                this._position.x++;
                break;
            case "z":
                this._position.z--;
                break;
        }
    }

    rotateRight() {
        this.#checkpoint();
        // 90deg clockwise rotation
        this._shape = this._shape[0].map((_, i) => this._shape.map(row => row[i]).reverse())
    }

    rotateLeft() {
        this.#checkpoint();
        // 90deg counterclockwise rotation
        this._shape =  this._shape[0].map((_, i) =>  this._shape.map(row => row[row.length - 1 - i]))
    }

    twist() {
        this.#checkpoint();
        switch (this._plane) {
            case "x":
                this._plane = "z";
                this._position.x--;
                this._position.z++;
                break;
            case "z":
                this._plane = "x";
                this._position.x++;
                this._position.z--;
                break;
        }
    }


}