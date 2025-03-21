import {COLS} from "../params";
import {generateRandomPiece} from "../pieces/generateRandomPiece";

export class Piece {
    constructor() {
        const {shape, color} = generateRandomPiece()
        this._shape = shape;
        this._position = {
            x: Math.floor(COLS / 2) - 1,
            y: Math.floor(COLS / 2) - 1,
            z: 0
        };
        this._color = color;
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

}