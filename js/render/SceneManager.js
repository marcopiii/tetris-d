import {COLS, ROWS} from "../params";
import * as THREE from "three";
import type {Board} from "../models/3DBoard";
import type {Piece} from "../models/3DPiece";
import {renderBlock} from "./renderBlock";

export class SceneManager {

    #BLOCK_SIZE = 1;
    #GRID_COLOR = "#8797a4"

    #config(scene: THREE.Scene) {
        scene.background = new THREE.Color("#b5c5d2");
        scene.rotation.y = THREE.MathUtils.degToRad(45);
        scene.rotation.x = THREE.MathUtils.degToRad(15);

        const yGrid = new THREE.GridHelper(COLS * this.#BLOCK_SIZE, COLS, this.#GRID_COLOR, this.#GRID_COLOR);
        yGrid.position.set(
            this.#BLOCK_SIZE / 2,
            -(ROWS + this.#BLOCK_SIZE) / 2,
            this.#BLOCK_SIZE / 2
        )

        const geometry = new THREE.PlaneGeometry(COLS * this.#BLOCK_SIZE, ROWS * this.#BLOCK_SIZE);
        const edges = new THREE.EdgesGeometry(geometry);
        const material = new THREE.LineBasicMaterial({ color: this.#GRID_COLOR, transparent: true, opacity: 0.5 });

        const xGrid = new THREE.LineSegments(edges, material);
        xGrid.rotateY(THREE.MathUtils.degToRad(90));
        xGrid.position.set(
            ((COLS + 1) * this.#BLOCK_SIZE) / 2 ,
            -this.#BLOCK_SIZE / 2,
            this.#BLOCK_SIZE / 2
        );

        const zGrid = new THREE.LineSegments(edges, material);
        zGrid.position.set(
            this.#BLOCK_SIZE / 2,
            -this.#BLOCK_SIZE / 2,
            -((COLS - 1) * this.#BLOCK_SIZE) / 2
        );

        scene.add(yGrid);
        scene.add(xGrid);
        scene.add(zGrid);
    }

    constructor() {
        this._scene = new THREE.Scene();
        this.#config(this._scene);
    }

    get scene() {
        return this._scene;
    }

    update(board: Board, piece: Piece) {
        this.reset();
        board.forEachBlock((color, y, x, z) => {
            const cube = renderBlock(color, y, x, z, this.#BLOCK_SIZE)
            this._scene.add(cube);
        })
        piece.forEachBlock((y, x, z) => {
            const cube = renderBlock(piece.color, y, x, z, this.#BLOCK_SIZE)
            this._scene.add(cube);
        })
    }

    reset() {
        this._scene = new THREE.Scene();
        this.#config(this._scene);
    }

}