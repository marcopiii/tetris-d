import {COLS, ROWS, MINO_SIZE} from "../params";
import * as THREE from "three";
import {
    createMino,
    createMinoShade,
    createBloomingMino,
    createGhostMino,
    createTetrionWall,
    tetrionFloor
} from "./createMesh";
import {createHoldHUD, createLevelHUD, createScoreHUD} from "./createHUD";
import type {Game} from "../gameplay/Game";
import type {Progress} from "../gameplay/Progress";
import {cuttingShadowMaterial} from "./materials";

export class SceneManager {

    #config(scene: THREE.Scene) {
        scene.background = new THREE.Color("#b5c5d2");

        const yGrid = tetrionFloor
        yGrid.position.set(
            MINO_SIZE / 2,
            -(ROWS + MINO_SIZE) / 2,
            MINO_SIZE / 2
        )

        const xlGrid = createTetrionWall();
        xlGrid.rotateY(THREE.MathUtils.degToRad(90));
        xlGrid.position.set(
            ((COLS + 1) * MINO_SIZE) / 2,
            -MINO_SIZE / 2,
            MINO_SIZE / 2
        );
        const xrGrid = createTetrionWall();
        xrGrid.rotateY(THREE.MathUtils.degToRad(-90));
        xrGrid.position.set(
            -((COLS - 1) * MINO_SIZE) / 2,
            -MINO_SIZE / 2,
            MINO_SIZE / 2
        );

        const zlGrid = createTetrionWall();
        zlGrid.position.set(
            MINO_SIZE / 2,
            -MINO_SIZE / 2,
            -((COLS - 1) * MINO_SIZE) / 2
        );
        const zrGrid = createTetrionWall();
        zrGrid.rotateY(THREE.MathUtils.degToRad(180));
        zrGrid.position.set(
            MINO_SIZE / 2,
            -MINO_SIZE / 2,
            ((COLS + 1) * MINO_SIZE) / 2
        );

        scene.add(yGrid);
        scene.add(xlGrid);
        scene.add(xrGrid);
        scene.add(zlGrid);
        scene.add(zrGrid);
    }

    constructor() {
        this._scene = new THREE.Scene();
        this._cutter = { below: false, above: false};
        this.#config(this._scene);
    }

    reset() {
        this._scene.clear();
        this.#config(this._scene);
    }

    get scene() {
        return this._scene;
    }

    set cutter(cutter: { below: boolean | undefined, above: boolean | undefined}) {
        this._cutter = {
            below: cutter.below ?? this._cutter.below,
            above: cutter.above ?? this._cutter.above
        };
    }

    update(game: Game, progress: Progress) {
        this.reset();

        const isCutOut = (y, x, z) => {
            return game.piece.plane === "x"
                ? this._cutter.below && x < game.piece.planePosition || this._cutter.above && x > game.piece.planePosition
                : this._cutter.below && z < game.piece.planePosition || this._cutter.above && z > game.piece.planePosition;
        }

        if (this._cutter.below) {
            const belowCutShadow = new THREE.Mesh(
                new THREE.PlaneGeometry(COLS * MINO_SIZE, game.piece.planePosition * MINO_SIZE),
                cuttingShadowMaterial
            );
            if (game.piece.plane === "x") {
                belowCutShadow.rotateZ(THREE.MathUtils.degToRad(90));
                belowCutShadow.rotateY(THREE.MathUtils.degToRad(90));
                belowCutShadow.position.set(
                    (game.piece.planePosition - COLS + 1) * MINO_SIZE / 2,
                    -(ROWS + MINO_SIZE) / 2,
                    MINO_SIZE / 2
                )
            } else {
                belowCutShadow.rotateX(THREE.MathUtils.degToRad(-90));
                belowCutShadow.position.set(
                    MINO_SIZE / 2,
                    -(ROWS + MINO_SIZE) / 2,
                    (game.piece.planePosition - COLS + 1) * MINO_SIZE / 2
                )
            }
            this._scene.add(belowCutShadow);
        }

        if (this._cutter.above) {
            const aboveCutShadow = new THREE.Mesh(
                new THREE.PlaneGeometry(COLS * MINO_SIZE, (COLS - 1 - game.piece.planePosition) * MINO_SIZE),
                cuttingShadowMaterial
            );
            if (game.piece.plane === "x") {
                aboveCutShadow.rotateZ(THREE.MathUtils.degToRad(90));
                aboveCutShadow.rotateY(THREE.MathUtils.degToRad(90));
                aboveCutShadow.position.set(
                    (game.piece.planePosition + 2) * MINO_SIZE / 2,
                    -(ROWS + MINO_SIZE) / 2,
                    MINO_SIZE / 2,
                )
            } else {
                aboveCutShadow.rotateX(THREE.MathUtils.degToRad(-90));
                aboveCutShadow.position.set(
                    MINO_SIZE / 2,
                    -(ROWS + MINO_SIZE) / 2,
                    (game.piece.planePosition + 2) * MINO_SIZE / 2
                )
            }
            this._scene.add(aboveCutShadow);
        }

        game.board.forEachBlock((type, y, x, z) => {
            if (isCutOut(y, x, z))
                return;
            const mino = type === "DELETE" ? createBloomingMino() : createMino(type)
            mino.position.set(translateX(x), translateY(y), translateZ(z));
            this._scene.add(mino);
        })

        game.ghostPiece.forEachBlock((y, x, z) => {
            const mino = createGhostMino(game.ghostPiece.type)
            mino.position.set(translateX(x), translateY(y), translateZ(z));
            this._scene.add(mino)
        })

        game.piece.forEachBlock((y, x, z) => {
            const mino = createMino(game.piece.type)
            mino.position.set(translateX(x), translateY(y), translateZ(z));
            this._scene.add(mino);

            const xrShadow = createMinoShade(game.piece.type)
            const xlShadow = createMinoShade(game.piece.type)
            const zlShadow = createMinoShade(game.piece.type)
            const zrShadow = createMinoShade(game.piece.type)

            xrShadow.rotateY(THREE.MathUtils.degToRad(-90))
            xlShadow.rotateY(THREE.MathUtils.degToRad(90))
            zrShadow.rotateY(THREE.MathUtils.degToRad(180))

            xrShadow.position.set(
                ((COLS + 1) * MINO_SIZE) / 2,
                translateY(y),
                translateZ(z)
            )
            xlShadow.position.set(
                -((COLS - 1) * MINO_SIZE) / 2,
                translateY(y),
                translateZ(z)
            )
            zlShadow.position.set(
                translateX(x),
                translateY(y),
                -((COLS - 1) * MINO_SIZE) / 2
            )
            zrShadow.position.set(
                translateX(x),
                translateY(y),
                ((COLS + 1) * MINO_SIZE) / 2
            )

            this._scene.add(xrShadow);
            this._scene.add(xlShadow);
            this._scene.add(zlShadow);
            this._scene.add(zrShadow);
        })

        const scoreHUD = createScoreHUD(progress.score)
        scoreHUD.position.set(
            -(COLS) * MINO_SIZE / 2,
            (ROWS - 3) * MINO_SIZE / 2,
            -(COLS - 1) * MINO_SIZE / 2
        );
        const levelHUD = createLevelHUD(progress.level)
        levelHUD.position.set(
            -(COLS) * MINO_SIZE / 2,
            (ROWS / 2) * MINO_SIZE / 2,
            -(COLS - 1) * MINO_SIZE / 2
        );
        this._scene.add(scoreHUD);
        this._scene.add(levelHUD);

        const holdHUD = createHoldHUD(
            game.hold.piece.shape,
            game.hold.piece.type,
            game.piece.isHoldable
        )
        holdHUD.position.set(
            (COLS + 1) * MINO_SIZE / 2,
            (ROWS - 3) * MINO_SIZE / 2,
            (COLS + 2) * MINO_SIZE / 2
        )
        this._scene.add(holdHUD);
    }

}

// translation from the Board coord system to the Scene coord system
const translateY = (y) => -(y + 1 - (ROWS / 2)) * MINO_SIZE;
const translateX = (x) => (x + 1 - (COLS / 2)) * MINO_SIZE;
const translateZ = (z) => (z + 1 - (COLS / 2)) * MINO_SIZE