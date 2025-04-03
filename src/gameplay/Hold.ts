import {Shape, Name as Tetrimino, getRandomTetrimino} from "../tetrimino";
import type {Piece} from "./Piece";

export class Hold {
    private _type: Tetrimino;
    private _shape: Shape;

    constructor() {
        const {type, shape} = getRandomTetrimino()
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