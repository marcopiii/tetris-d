import {COLS, ROWS, BLOCK_SIZE} from "../params";
import * as THREE from "three";
import type {Board} from "../gameplay/3DBoard";
import type {Piece} from "../gameplay/3DPiece";
import {createBlock} from "./createBlock";
import {createShadow} from "./createShadow";

export class SceneManager {

    #GRID_COLOR = "#8797a4"

    #config(scene: THREE.Scene) {
        scene.background = new THREE.Color("#b5c5d2");

        const yGrid = new THREE.GridHelper(COLS * BLOCK_SIZE, COLS, this.#GRID_COLOR, this.#GRID_COLOR);
        yGrid.position.set(
            BLOCK_SIZE / 2,
            -(ROWS + BLOCK_SIZE) / 2,
            BLOCK_SIZE / 2
        )

        const geometry = new THREE.PlaneGeometry(COLS * BLOCK_SIZE, ROWS * BLOCK_SIZE);
        const edges = new THREE.EdgesGeometry(geometry);
        const material = new THREE.LineBasicMaterial({ color: this.#GRID_COLOR, transparent: true, opacity: 0.5 });

        const xGrid = new THREE.LineSegments(edges, material);
        xGrid.rotateY(THREE.MathUtils.degToRad(90));
        xGrid.position.set(
            ((COLS + 1) * BLOCK_SIZE) / 2,
            -BLOCK_SIZE / 2,
            BLOCK_SIZE / 2
        );

        const zGrid = new THREE.LineSegments(edges, material);
        zGrid.position.set(
            BLOCK_SIZE / 2,
            -BLOCK_SIZE / 2,
            -((COLS - 1) * BLOCK_SIZE) / 2
        );

        scene.add(yGrid);
        scene.add(xGrid);
        scene.add(zGrid);
    }

    constructor() {
        this._scene = new THREE.Scene();
        this.#config(this._scene);
    }

    reset() {
        this._scene = new THREE.Scene();
        this.#config(this._scene);
    }

    get scene() {
        return this._scene;
    }

    update(board: Board, piece: Piece) {
        // translation from the Board coord system to the Scene coord system
        const translateY = (y) => -(y + 1 - (ROWS / 2)) * BLOCK_SIZE;
        const translateX = (x) => (x + 1 - (COLS / 2)) * BLOCK_SIZE;
        const translateZ = (z) => (z + 1 - (COLS / 2)) * BLOCK_SIZE

        this.reset();
        board.forEachBlock((color, y, x, z) => {
            const cube = createBlock(color, BLOCK_SIZE)
            cube.position.set(translateX(x), translateY(y), translateZ(z));
            this._scene.add(cube);
        })
        piece.forEachBlock((y, x, z) => {
            const cube = createBlock(piece.color)
            cube.position.set(translateX(x), translateY(y), translateZ(z));

            const xShadow = createShadow(piece.color)
            xShadow.rotateY(THREE.MathUtils.degToRad(-90))
            xShadow.position.set(
                ((COLS + 1) * BLOCK_SIZE) / 2,
                translateY(y),
                translateZ(z)
            )

            const zShadow = createShadow(piece.color)
            zShadow.position.set(
                translateX(x),
                translateY(y),
                -((COLS - 1) * BLOCK_SIZE) / 2
            )

            this._scene.add(cube);
            this._scene.add(xShadow);
            this._scene.add(zShadow);
        })
    }

}