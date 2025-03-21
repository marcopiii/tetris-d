import {COLS, ROWS} from "../params";

export class Board {
    // construction order is z > y > x
    constructor() {
        this._matrix = Array(ROWS).fill().map(
            () => Array(COLS).fill().map(
                () => Array(COLS).fill(null)
            )
        );
    }

    fixPiece(piece) {
        for (let shapeZ = 0; shapeZ < piece.shape.length; shapeZ++) {
            for (let shapeY = 0; shapeY < piece.shape[shapeZ].length; shapeY++) {
                for (let shapeX = 0; shapeX < piece.shape[shapeZ][shapeY].length; shapeX++) {
                    if (piece.shape[shapeZ][shapeY][shapeX] !== null) {
                        this._matrix[piece.position.z + shapeZ][piece.position.y + shapeY][piece.position.x + shapeX] = piece.color;
                    }
                }
            }
        }
    }

    plane(
        side: "x" | "y",
        index: number,
    ): Array<Array<string | null>> {
        return Array(ROWS).fill().map((_, z) => {
            if (side === "x") {
                return Array(COLS).fill().map((_, y) => this._matrix[z][y][index]);
            } else {
                return this._matrix[z][index];
            }
        });
    }

    check() {
        function checkPlane(plane: Array<Array<string | null>>) {
            const bottomRowIndex = plane.length - 1;
            for (let row = bottomRowIndex; row >= 0; row--) {
                if (plane[row].every(cell => cell !== null)) {
                    plane.splice(row, 1);
                    plane.unshift(Array(COLS).fill(null));
                    row++; // Recheck the same row after clearing
                }
            }
        }
        Array("x", "y").forEach(side => {
            Array(COLS).fill().forEach((_, i) => {
                checkPlane(this.plane(side, i));
            });
        });
    }

    clean() {
        this._matrix.forEach(
            layer => layer.forEach(
                yRow => yRow.fill(null)
            )
        );
    }

}