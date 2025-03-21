import * as THREE from "three";
import type {Board} from "../models/3DBoard";
import {renderBlock} from "./renderBlock";

export class SceneManager {

    #config(scene: THREE.Scene) {
        scene.background = new THREE.Color("#656565");
        scene.rotation.y = THREE.MathUtils.degToRad(45);
        scene.rotation.x = THREE.MathUtils.degToRad(15);
    }

    constructor() {
        this._scene = new THREE.Scene();
        this.#config(this._scene);
    }

    get scene() {
        return this._scene;
    }

    update(board: Board) {
        this.reset();
        board.forEachBlock((color, y, x, z) => {
            if (color) {
                renderBlock(this._scene, color, y, x, z)
            }
        })
    }

    reset() {
        this._scene = new THREE.Scene();
        this.#config(this._scene);
    }

}