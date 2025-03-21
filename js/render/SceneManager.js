import * as THREE from "three";
import type {Board} from "../models/3DBoard";

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
        const geometry = new THREE.BoxGeometry(BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);

        this.reset();

        board.forEachBlock((color, y, x, z) => {
            if (color) {
                const material = new THREE.MeshBasicMaterial({color});
                const cube = new THREE.Mesh(geometry, material);
                cube.position.set(x * BLOCK_SIZE, -y * BLOCK_SIZE, -z * BLOCK_SIZE);
                this._scene.add(cube)
            }
        })
    }

    reset() {
        this._scene = new THREE.Scene();
        this._scene.background = new THREE.Color("#656565");
    }

}