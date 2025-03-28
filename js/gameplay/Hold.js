import {generateRandomPiece} from "../pieces/generateRandomPiece";
import type {Piece} from "./3DPiece";

export class Hold {

    constructor() {
        const {type, shape, color} = generateRandomPiece()
        this._type = type;
        this._shape = shape;
        this._color = color;
    }

    replace(piece: Piece) {
        const hold = {
            type: this._type,
            shape: this._shape,
            color: this._color
        }
        this._type = piece.type;
        this._shape = piece.shape;
        this._color = piece.color;
        return hold
    }

}