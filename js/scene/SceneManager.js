import {COLS, ROWS, BLOCK_SIZE} from "../params";
import * as THREE from "three";
import type {Board} from "../gameplay/3DBoard";
import type {Piece} from "../gameplay/3DPiece";
import {createBlock, createBloomingBlock, createGhostBlock, createVoxel} from "./createVoxel";
import {createShadow} from "./createShadow";
import {createHoldHUD, createLevelHUD, createScoreHUD} from "./createHUD";
import type {Hold} from "../gameplay/Hold";

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
        this._scene.clear();
        this.#config(this._scene);
    }

    get scene() {
        return this._scene;
    }

    update(board: Board, piece: Piece, ghost: Piece, hold: Hold, score: number, level: number) {
        this.reset();

        board.forEachBlock((color, y, x, z) => {
            const cube = color === "DELETE" ? createBloomingBlock() : createBlock(color)
            cube.position.set(translateX(x), translateY(y), translateZ(z));
            this._scene.add(cube);
        })

        ghost.forEachBlock((y, x, z) => {
            const cube = createGhostBlock(ghost.color)
            cube.position.set(translateX(x), translateY(y), translateZ(z));
            this._scene.add(cube)
        })

        piece.forEachBlock((y, x, z) => {
            const cube = createBlock(piece.color)
            cube.position.set(translateX(x), translateY(y), translateZ(z));
            this._scene.add(cube);

            const xShadow = createShadow(piece.color)
            xShadow.rotateY(THREE.MathUtils.degToRad(-90))
            xShadow.position.set(
                ((COLS + 1) * BLOCK_SIZE) / 2,
                translateY(y),
                translateZ(z)
            )
            this._scene.add(xShadow);

            const zShadow = createShadow(piece.color)
            zShadow.position.set(
                translateX(x),
                translateY(y),
                -((COLS - 1) * BLOCK_SIZE) / 2
            )
            this._scene.add(zShadow);
        })

        const scoreHUD = createScoreHUD(score)
        scoreHUD.position.set(
            -(COLS) * BLOCK_SIZE / 2,
            (ROWS - 3) * BLOCK_SIZE / 2,
            -(COLS - 1) * BLOCK_SIZE / 2
        );
        const levelHUD = createLevelHUD(level)
        levelHUD.position.set(
            -(COLS) * BLOCK_SIZE / 2,
            (ROWS / 2) * BLOCK_SIZE / 2,
            -(COLS - 1) * BLOCK_SIZE / 2
        );
        this._scene.add(scoreHUD);
        this._scene.add(levelHUD);

        const holdHUD = createHoldHUD(hold.piece.shape, hold.piece.color, piece.isHoldable)
        holdHUD.position.set(
            (COLS + 1) * BLOCK_SIZE / 2,
            (ROWS - 3) * BLOCK_SIZE / 2,
            (COLS + 2) * BLOCK_SIZE / 2
        )
        this._scene.add(holdHUD);
    }

}

// translation from the Board coord system to the Scene coord system
const translateY = (y) => -(y + 1 - (ROWS / 2)) * BLOCK_SIZE;
const translateX = (x) => (x + 1 - (COLS / 2)) * BLOCK_SIZE;
const translateZ = (z) => (z + 1 - (COLS / 2)) * BLOCK_SIZE