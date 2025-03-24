import {BLOCK_SIZE} from "./params";
import * as THREE from "three";
import TWEEN from "@tweenjs/tween.js";
import {Vector3} from "three";

export class CameraManager {

    #frustumSize = 25;

    #setup = {
        "x-plane": {
            position: new Vector3( -10, 0, 0.5 * BLOCK_SIZE),
            lookAt: new Vector3(0,0,0.5 * BLOCK_SIZE),
        },
        "z-plane": {
            position: new Vector3(0.5 * BLOCK_SIZE, 0, 10),
            lookAt: new Vector3(0.5 * BLOCK_SIZE, 0, 0)
        },
        "isometric": {
            position: new Vector3(-10, 5, 10 + BLOCK_SIZE),
            lookAt: new Vector3(0, 0, BLOCK_SIZE)
        }
    }

    constructor(container: HTMLElement) {
        const aspect = container.clientWidth / container.clientHeight
        this._tweenGroup = new TWEEN.Group();
        this._camera = new THREE.OrthographicCamera(
            - this.#frustumSize * aspect / 2,
            this.#frustumSize * aspect / 2,
            this.#frustumSize / 2,
            - this.#frustumSize / 2
        );
        this.move("isometric");
    }

    get camera() {
        return this._camera;
    }

    get tween() {
        return this._tweenGroup;
    }

    move(position: "x-plane" | "z-plane" | "isometric") {
        let target;
        switch (position) {
            case "x-plane":
                target = this.#setup["x-plane"];
                break;
            case "z-plane":
                target = this.#setup["z-plane"];
                break;
            case "isometric":
                target = this.#setup["isometric"];
                break;
        }
        new TWEEN.Tween(this._camera.position, this._tweenGroup)
            .to(target.position, 500)
            .easing(TWEEN.Easing.Exponential.Out)
            .onUpdate(() => {
                this._camera.lookAt(target.lookAt)
            })
            .start();
    }

}