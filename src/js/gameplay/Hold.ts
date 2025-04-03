import {generateRandomPiece} from "../pieces/generateRandomPiece";
import type {Piece} from "./3DPiece";

export class Hold {

    constructor() {
        const {type, shape} = generateRandomPiece()
        this._type = type;
        this._shape = shape;
    }

    get piece() {
        return {
            type: this._type,
            shape: this._shape,
        }
    }

    replace(piece: Piece) {
        const hold = {
            type: this._type,
            shape: this._shape,
        }
        this._type = piece.type;
        this._shape = piece.shape;
        return hold
    }

}