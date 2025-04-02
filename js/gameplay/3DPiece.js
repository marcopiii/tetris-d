import {COLS} from "../params";
import {generateRandomPiece} from "../pieces/generateRandomPiece";
import {copy} from "../utils";
import {wallKickData} from "../pieces/wallKickData";

export class Piece {
    constructor(plane: "x" | "z" = "z") {
        const {type, shape} = generateRandomPiece()
        this._type = type;
        this._shape = shape;
        this._rotationState = "0";
        this._position = initPosition(plane, shape);
        this._plane = plane;
        this._prev = {
            position: copy(this._position),
            rotationState: copy(this._rotationState),
            shape: copy(this._shape),
            plane: copy(this._plane)
        };
        this._holdable = true;
    }

    get shape() {
        return this._shape;
    }

    get type() {
        return this._type;
    }

    get plane() {
        return this._plane;
    }

    get planePosition() {
        return this._plane === "x"
            ? this._position.x
            : this._position.z;
    }

    get isHoldable() {
        return this._holdable;
    }

    clone() {
        const piece = new Piece(this._plane);
        piece._shape = copy(this._shape);
        piece._position = copy(this._position);
        piece._prev = copy(this._prev);
        piece._type = this._type;
        return piece;
    }

    /**
     * @param hold {{type, shape}}
     */
    replace(hold) {
        if (!this._holdable)
            throw new Error("Piece is not holdable");
        this._type = hold.type;
        this._shape = hold.shape;
        this._rotationState = "0";
        this._position = initPosition(this._plane, hold.shape);
        this._prev = {
            position: copy(this._position),
            rotationState: copy(this._rotationState),
            shape: copy(this._shape),
            plane: copy(this._plane)
        };
        this._holdable = false;
    }

    /**
     * Applies the given callback to each existing block of the piece.
     * @param callback - The callback to apply to each block, given its coordinates in the board.
     */
    forEachBlock(callback: (number, number, number) => void) {
        this._shape.forEach((layer, dy) =>
            layer.forEach((exists, k) => {
                if (!exists) return;
                const dx = this._plane === "x" ? 0 : k;
                const dz = this._plane === "z" ? 0 : k;
                callback(
                    this._position.y + dy,
                    this._position.x + dx,
                    this._position.z + dz
                );
            })
        );
    }

    #checkpoint() {
        this._prev = {
            position: copy(this._position),
            shape: copy(this._shape),
            rotationState: copy(this._rotationState),
            plane: copy(this._plane)
        };
    }

    rollback() {
        this._position = copy(this._prev.position);
        this._shape = copy(this._prev.shape);
        this._rotationState = copy(this._prev.rotationState);
        this._plane = copy(this._prev.plane);
    }

    drop() {
        this.#checkpoint();
        this._position.y++;
    }

    shiftRight() {
        this.#checkpoint();
        switch (this._plane) {
            case "x":
                this._position.z++;
                break;
            case "z":
                this._position.x++;
                break;
        }
    }

    shiftLeft() {
        this.#checkpoint();
        switch (this._plane) {
            case "x":
                this._position.z--;
                break;
            case "z":
                this._position.x--;
                break;
        }
    }

    shiftForward() {
        this.#checkpoint();
        switch (this._plane) {
            case "x":
                this._position.x--;
                break;
            case "z":
                this._position.z++;
                break;
        }
    }

    shiftBackward() {
        this.#checkpoint();
        switch (this._plane) {
            case "x":
                this._position.x++;
                break;
            case "z":
                this._position.z--;
                break;
        }
    }

    #applyWallKick(offset: [number, number]) {
        if (this._plane === "x")
            this._position.z += offset[0];
        if (this._plane === "z")
            this._position.x += offset[0];
        this ._position.y -= offset[1];
    }

    rotateRight(wallKickTest: number) {
        this.#checkpoint();

        let finalRotationState;
        if (this._rotationState === "0") finalRotationState = "R"
        else if (this._rotationState === "R") finalRotationState = "2"
        else if (this._rotationState === "2") finalRotationState = "L"
        else if (this._rotationState === "L") finalRotationState = "0"

        const wallKick = wallKickData(this._type)
            .find(wkd => wkd.initial === this._rotationState && wkd.final === finalRotationState)
            .tests[wallKickTest];

        this._shape = this._shape[0].map((_, i) => this._shape.map(row => row[i]).reverse())
        this.#applyWallKick(wallKick)
        this._rotationState = finalRotationState;
    }

    rotateLeft(wallKickTest: number) {
        this.#checkpoint();

        let finalRotationState;
        if (this._rotationState === "0") finalRotationState = "L"
        else if (this._rotationState === "L") finalRotationState = "2"
        else if (this._rotationState === "2") finalRotationState = "R"
        else if (this._rotationState === "R") finalRotationState = "0"

        const wallKick = wallKickData(this._type)
            .find(wkd => wkd.initial === this._rotationState && wkd.final === finalRotationState)
            .tests[wallKickTest];

        this._shape = this._shape[0].map((_, i) => this._shape.map(row => row[row.length - 1 - i]))
        this.#applyWallKick(wallKick)
        this._rotationState = finalRotationState;
    }

}

function initPosition(plane, shape) {
    return plane === "x"
        ? {
            x: Math.floor((COLS - 1) / 2),
            z: Math.ceil((COLS - 1 - shape.length) / 2),
            y: 0
        } : {
            x: Math.ceil((COLS - 1 - shape.length) / 2),
            z: Math.floor((COLS - 1) / 2),
            y: 0
        }
}