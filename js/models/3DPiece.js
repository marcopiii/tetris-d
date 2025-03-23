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
        this._shape.forEach((layer, dy) =>
            layer.forEach((exists, h) => {
                if (!exists) return;
                const dx = this._plane === "x" ? h : 0;
                const dz = this._plane === "z" ? h : 0;
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

    rotateRight() {
        const yLength = this._shape.length;
        const xLength = this._shape[0].length;
        const zLength = this._shape[0][0].length;

        const rotatedShape = Array.from({ length: zLength }, () =>
            Array.from({ length: xLength }, () =>
                Array(yLength).fill(0)
            )
        );

        for (let y = 0; y < yLength; y++) {
            for (let x = 0; x < xLength; x++) {
                for (let z = 0; z < zLength; z++) {
                    rotatedShape[zLength - 1 - z][x][y] = this._shape[y][x][z];
                }
            }
        }

        this._shape = rotatedShape;
    }

    rotateLeft() {
        const yLength = this._shape.length;
        const xLength = this._shape[0].length;
        const zLength = this._shape[0][0].length;

        const rotatedShape = Array.from({ length: zLength }, () =>
            Array.from({ length: xLength }, () =>
                Array(yLength).fill(0)
            )
        );

        for (let y = 0; y < yLength; y++) {
            for (let x = 0; x < xLength; x++) {
                for (let z = 0; z < zLength; z++) {
                    rotatedShape[z][x][yLength - 1 - y] = this._shape[y][x][z];
                }
            }
        }

        this._shape = rotatedShape;
    }

    twistRight() {
        const yLength = this._shape.length;
        const xLength = this._shape[0].length;
        const zLength = this._shape[0][0].length;

        const rotatedShape = Array.from({ length: yLength }, () =>
            Array.from({ length: zLength }, () =>
                Array(xLength).fill(0)
            )
        );

        for (let y = 0; y < yLength; y++) {
            for (let x = 0; x < xLength; x++) {
                for (let z = 0; z < zLength; z++) {
                    rotatedShape[y][zLength - 1 - z][x] = this._shape[y][x][z];
                }
            }
        }

        this._shape = rotatedShape;
    }

    twistLeft() {
        const yLength = this._shape.length;
        const xLength = this._shape[0].length;
        const zLength = this._shape[0][0].length;

        const rotatedShape = Array.from({ length: yLength }, () =>
            Array.from({ length: zLength }, () =>
                Array(xLength).fill(0)
            )
        );

        for (let y = 0; y < yLength; y++) {
            for (let x = 0; x < xLength; x++) {
                for (let z = 0; z < zLength; z++) {
                    rotatedShape[y][z][xLength - 1 - x] = this._shape[y][x][z];
                }
            }
        }

        this._shape = rotatedShape;
    }


}