import {COLS, ROWS} from "../params";
import type {Piece} from "./3DPiece";

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

    clean() {
        this._matrix = Array(ROWS).fill().map(
            () => Array(COLS).fill().map(
                () => Array(COLS).fill(null)
            )
        );
    }

}