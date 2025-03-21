import {COLS} from "../params";
import {generateRandomPiece} from "../pieces/generateRandomPiece";

export class Piece {
    constructor() {
        const {shape, color, name} = generateRandomPiece()

        console.log(`${name} spawned`)

        this._name = name;
        this._shape = shape;
        this._position = {
            x: Math.floor(COLS / 2) - 1,
            z: Math.floor(COLS / 2) - 1,
            y: 0
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