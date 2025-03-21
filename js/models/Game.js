import {Piece} from "./Piece";
import {Board} from "./Board";
import {detectCollision} from "../detectCollision";

export class Game {
    constructor() {
        this._boards = Array(3).fill().map(() => new Board());
        this._activeBoardIndex = 0;
        this._currentPiece = new Piece();
    }

    get boards() {
        return this._boards;
    }

    get activeBoard(): Board {
        return this._boards[this._activeBoardIndex];
    }

    get activeBoardIndex() {
        return this._activeBoardIndex;
    }

    get currentPiece() {
        return this._currentPiece;
    }

    movePiece(type: "shift" | "rotate" | "jump", direction: "left" | "right") {
        const prevBoard = this._activeBoardIndex.valueOf();
        switch (type) {
            case "shift":
                direction === "left"
                    ? this.currentPiece.shiftLeft()
                    : this.currentPiece.shiftRight();
                break;
            case "rotate":
                direction === "left"
                    ? this.currentPiece.rotateLeft()
                    : this.currentPiece.rotateRight();
                break;
            case "jump":
                direction === "left"
                    ? this._activeBoardIndex = (this._activeBoardIndex + 2) % 3
                    : this._activeBoardIndex = (this._activeBoardIndex + 1) % 3;
                break;
        }
        if (detectCollision(this.activeBoard, this.currentPiece)) {
            switch (type) {
                case "shift":
                    this.currentPiece.rollback();
                    break;
                case "rotate":
                    this.currentPiece.rollback();
                    break;
                case "jump":
                    this._activeBoardIndex = prevBoard;
                    break;
            }
        }
    }

    reset() {
        this._boards.forEach(board => board.clean());
        this._currentPiece = new Piece();
        this._activeBoardIndex = 0;
    }

    /** Progresses the game by one tick.
     * @return {boolean} - Whether the game is over
     */
    tick() {
        this.currentPiece.drop()
        if (detectCollision(this.activeBoard, this.currentPiece)) {
            this.currentPiece.rollback();
            this.activeBoard.fixPiece(this.currentPiece);
            this.activeBoard.checkRows();
            this._currentPiece = new Piece();
            if (detectCollision(this.activeBoard, this.currentPiece)) {
                return true;
            }
        }
        return false;
    }

}