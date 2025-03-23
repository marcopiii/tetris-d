import {BLOCK_SIZE} from "./params";
import * as THREE from "three";

export class CameraManager {

    #frustumSize = 25;

    constructor(container: HTMLElement) {
        const aspect = container.clientWidth / container.clientHeight
        this._camera = new THREE.OrthographicCamera(
            - this.#frustumSize * aspect / 2,
            this.#frustumSize * aspect / 2,
            this.#frustumSize / 2,
            - this.#frustumSize / 2
        );
        this._camera.position.set(-10, 5, 10 + BLOCK_SIZE );
        this._camera.lookAt(0, 0, BLOCK_SIZE)
    }

    get camera() {
        return this._camera;
    }

    move(position: "x-plane" | "z-plane" | "isometric") {
        switch (position) {
            case "x-plane":
                this._camera.position.set(10, 0, 0.5 * BLOCK_SIZE);
                this._camera.lookAt(0, 0, 0.5 * BLOCK_SIZE)
                break;
            case "z-plane":
                this._camera.position.set(0.5 * BLOCK_SIZE, 0, 10);
                this._camera.lookAt(0.5 * BLOCK_SIZE,0,0)
                break;
            case "isometric":
                this._camera.position.set(-10, 5, 10 + BLOCK_SIZE );
                this._camera.lookAt(0, 0, BLOCK_SIZE)
                break;
        }
    }

}