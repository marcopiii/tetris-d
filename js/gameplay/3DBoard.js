import {COLS, ROWS} from "../params";
import type {Piece} from "./3DPiece";
import {range} from "three/tsl";

export class Board {

    /*
    The board is a 3D matrix of colors. Each cell can be null or a tetramino type.
    The first dimension is the Y axis (vertical), the second is the X axis (horizontal) and the third is the Z axis (horizontal).
     */
    constructor() {
        this._matrix = Array(ROWS).fill().map(
            () => Array(COLS).fill().map(
                () => Array(COLS).fill(null)
            )
        );
    }

    blockAt(y: number, x: number, z: number) {
        return this._matrix[y][x][z];
    }

    /**
     * Applies the given callback to each existing block of the board.
     * @param callback
     */
    forEachBlock(callback: (type: string, y: number, x: number, z: number) => void) {
        this._matrix.forEach((layer, y) =>
            layer.forEach((xRow, x) =>
                xRow.forEach((type, z) => {
                        if (type) callback(type, y, x, z)
                    }
                )
            )
        );
    }

    /**
     * Inserts a piece into the board.
     * @param piece
     */
    fixPiece(piece: Piece) {
        piece.forEachBlock((y, x, z) => {
            this._matrix[y][x][z] = piece.type
        })
    }

    #deleteBlock(y: number, x: number, z: number) {
        for (let dy = y; dy > 0; dy--) {
            this._matrix[dy][x][z] = this._matrix[dy - 1][x][z];
        }
        this._matrix[0][x][z] = null;
    }

    checkLines() {
        const checkZAxisRow = (y: number, x: number) => {
            for (let z = 0; z < COLS; z++) {
                if (!this._matrix[y][x][z]) return false;
            }
            return true;
        }
        const checkXAxisRow = (y: number, z: number) => {
            for (let x = 0; x < COLS; x++) {
                if (!this._matrix[y][x][z]) return false;
            }
            return true;
        }

        let clearedLines = 0;
        for (let y = 0; y < ROWS; y++) {
            for (let z = 0; z < COLS; z++) {
                if (checkXAxisRow(y, z)) {
                    for (let x = 0; x < COLS; x++) {
                        this._matrix[y][x][z] = "DELETE";
                    }
                    clearedLines++;
                }
            }
            for (let x = 0; x < COLS; x++) {
                if (checkZAxisRow(y, x)) {
                    for (let z = 0; z < COLS; z++) {
                        this._matrix[y][x][z] = "DELETE";
                    }
                    clearedLines++;
                }
            }
        }
        return clearedLines;
    }

    clearLines() {
        let clearedLines = false;
        for (let x = 0; x < COLS; x++) {
            for (let z = 0; z < COLS; z++) {
                let y = ROWS - 1;
                while (y >= 0) {
                    if (this._matrix[y][x][z] === "DELETE") {
                        this.#deleteBlock(y, x, z);
                        clearedLines = true;
                    } else {
                        y--;
                    }
                }
            }
        }
        return clearedLines;
    }

    clean() {
        this._matrix = Array(ROWS).fill().map(
            () => Array(COLS).fill().map(
                () => Array(COLS).fill(null)
            )
        );
    }

}