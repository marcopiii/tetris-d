import {Piece} from "./3DPiece";
import {Board} from "./3DBoard";

export class Game {
    constructor() {
        this._board = new Board();
        this._currentPiece = new Piece();
    }

    get board() {
        return this._board;
    }

    get currentPiece() {
        return this._currentPiece;
    }

    reset() {
        this._board.clean();
        this._currentPiece = new Piece();
    }

}