import * as THREE from "three";
import type {Board} from "../models/3DBoard";
import {COLS, ROWS} from "../params";

export class SceneManager {
    constructor() {
        this._scene = new THREE.Scene();
        this._scene.background = new THREE.Color("#656565");
    }

    get scene() {
        return this._scene;
    }

    update(board: Board) {
        const BLOCK_SIZE = 1;

        const translateX = (n) => (n - (COLS / 2)) * BLOCK_SIZE;
        const translateY = (n) => -(n - (ROWS / 2)) * BLOCK_SIZE;
        const translateZ = (n) => -(n - (COLS / 2)) * BLOCK_SIZE

        const geometry = new THREE.BoxGeometry(BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);

        this.reset();

        board.forEachBlock((color, y, x, z) => {
            if (color) {
                const material = new THREE.MeshBasicMaterial({color});
                const cube = new THREE.Mesh(geometry, material);
                cube.position.set(translateX(x), translateY(y), translateZ(z));
                this._scene.add(cube)
            }
        })
    }

    reset() {
        this._scene = new THREE.Scene();
        this._scene.background = new THREE.Color("#656565");
    }

}