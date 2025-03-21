import * as THREE from "three";

export class SceneManager {
    constructor() {
        this._scene = new THREE.Scene();
        this._scene.background = new THREE.Color("#656565");
    }

    get scene() {
        return this._scene;
    }

    addMesh(mesh) {
        this._scene.add(mesh);
    }

    reset() {
        this._scene = new THREE.Scene();
        this._scene.background = new THREE.Color("#656565");
    }

}