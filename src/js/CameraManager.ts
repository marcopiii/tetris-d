import * as THREE from "three";
import TWEEN, {Group as TWEENGroup} from "@tweenjs/tween.js";
import {MINO_SIZE} from "./params";
import {Vector3} from "three";
import {CameraConfiguration, Position} from "./types";

export class CameraManager {

    private readonly _camera: THREE.Camera;
    private readonly _tweenGroup: TWEENGroup;
    private _position: Position

    private frustumSize = 25;

    config: Record<Position, CameraConfiguration> = {
        "xR_zR": {
            position: new Vector3(-10, 5, 10 + MINO_SIZE),
            lookAt: new Vector3(0, 0, MINO_SIZE)
        },
        "xL_zR": {
            position: new Vector3(10, 5, 10 + MINO_SIZE),
            lookAt: new Vector3(0, 0, MINO_SIZE)
        },
        "xL_zL": {
            position: new Vector3(10, 4, -10 + MINO_SIZE),
            lookAt: new Vector3(0, -1, + MINO_SIZE)
        },
        "xR_zL": {
            position: new Vector3(-10, 5, -10 - MINO_SIZE),
            lookAt: new Vector3(0, 0, -MINO_SIZE)
        },
        "x0_zR": {
            position: new Vector3( -10, 0, 0.5 * MINO_SIZE),
            lookAt: new Vector3(0,0,0.5 * MINO_SIZE),
        },
        "x0_zL": {
            position: new Vector3( 10, 0, 0.5 * MINO_SIZE),
            lookAt: new Vector3(0,0,0.5 * MINO_SIZE),
        },
        "xR_z0": {
            position: new Vector3(0.5 * MINO_SIZE, 0, 10),
            lookAt: new Vector3(0.5 * MINO_SIZE, 0, 0)
        },
        "xL_z0": {
            position: new Vector3(0.5 * MINO_SIZE, 0, -10),
            lookAt: new Vector3(0.5 * MINO_SIZE, 0, 0)
        }
    }

    constructor(container: HTMLElement) {
        const aspect = container.clientWidth / container.clientHeight
        this._tweenGroup = new TWEEN.Group();
        this._position = "xR_zR"
        this._camera = new THREE.OrthographicCamera(
            - this.frustumSize * aspect / 2,
            this.frustumSize * aspect / 2,
            this.frustumSize / 2,
            - this.frustumSize / 2
        );
        const initPosition = this.config[this._position];
        this._camera.position.set(initPosition.position.x, initPosition.position.y, initPosition.position.z);
        this._camera.lookAt(this.config[this._position].lookAt);
    }

    get camera() {
        return this._camera;
    }

    get tween() {
        return this._tweenGroup;
    }

    move(direction: "right" | "left") {
        switch (this._position) {
            case "xR_zR":
                this._position = direction === "right" ? "xL_zR" : "xR_zL";
                break;
            case "xL_zR":
                this._position = direction === "right" ? "xL_zL" : "xR_zR";
                break;
            case "xL_zL":
                this._position = direction === "right" ? "xR_zL" : "xL_zR";
                break;
            case "xR_zL":
                this._position = direction === "right" ? "xR_zR" : "xL_zL";
                break;
        }
        const target = this.config[this._position];
        new TWEEN.Tween(this._camera.position, this._tweenGroup)
            .to(target.position, 500)
            .easing(TWEEN.Easing.Exponential.Out)
            .onUpdate(() => {
                this._camera.lookAt(target.lookAt)
            })
            .start();
    }

}