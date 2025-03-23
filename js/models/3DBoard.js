import {COLS, ROWS} from "../params";
import type {Piece} from "./3DPiece";
import {range} from "three/tsl";

export class Board {

    /*
    The board is a 3D matrix of colors. Each cell can be null or a color.
    The first dimension is the Y axis (vertical), the second is the X axis (horizontal) and the third is the Z axis (depth).
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
    forEachBlock(callback: (color: string, y: number, x: number, z: number) => void) {
        this._matrix.forEach((layer, y) =>
            layer.forEach((xRow, x) =>
                xRow.forEach((color, z) => {
                        if (color) callback(color, y, x, z)
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
        const {shape, position, color} = piece;
        for (let y = 0; y < shape.length; y++) {
            for (let x = 0; x < shape[y].length; x++) {
                for (let z = 0; z < shape[y][x].length; z++) {
                    if (shape[y][x][z]) {
                        this._matrix[y + position.y][x + position.x][z + position.z] = color;
                    }
                }
            }
        }
    }

    checkRows() {
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

        const deleteBlock = (y: number, x: number, z: number) => {
            for (let dy = y; dy > 0; dy--) {
                this._matrix[dy][x][z] = this._matrix[dy - 1][x][z];
            }
            this._matrix[0][x][z] = null;
        }

        for (let y = 0; y < ROWS; y++) {
            for (let z = 0; z < COLS; z++) {
                if (checkXAxisRow(y, z)) {
                    for (let x = 0; x < COLS; x++) {
                        this._matrix[y][x][z] = "DELETE";
                    }
                }
            }
            for (let x = 0; x < COLS; x++) {
                if (checkZAxisRow(y, x)) {
                    for (let z = 0; z < COLS; z++) {
                        this._matrix[y][x][z] = "DELETE";
                    }
                }
            }
        }

        for (let x = 0; x < COLS; x++) {
            for (let z = 0; z < COLS; z++) {
                let y = ROWS - 1;
                while (y >= 0) {
                    if (this._matrix[y][x][z] === "DELETE")
                        deleteBlock(y, x, z);
                    else
                        y--;
                }
            }
        }
    }

    clean() {
        this._matrix = Array(ROWS).fill().map(
            () => Array(COLS).fill().map(
                () => Array(COLS).fill(null)
            )
        );
    }

}