import {COLS, ROWS, BLOCK_SIZE} from "../params";
import * as THREE from "three";
import {createBlock, createBloomingBlock, createGhostBlock} from "./createVoxel";
import {createShadow} from "./createShadow";
import {createHoldHUD, createLevelHUD, createScoreHUD} from "./createHUD";
import type {Game} from "../gameplay/Game";
import type {Progress} from "../gameplay/Progress";

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

        const xlGrid = new THREE.LineSegments(edges, material);
        xlGrid.rotateY(THREE.MathUtils.degToRad(90));
        xlGrid.position.set(
            ((COLS + 1) * BLOCK_SIZE) / 2,
            -BLOCK_SIZE / 2,
            BLOCK_SIZE / 2
        );
        const xrGrid = new THREE.LineSegments(edges, material);
        xrGrid.rotateY(THREE.MathUtils.degToRad(-90));
        xrGrid.position.set(
            -((COLS - 1) * BLOCK_SIZE) / 2,
            -BLOCK_SIZE / 2,
            BLOCK_SIZE / 2
        );

        const zlGrid = new THREE.LineSegments(edges, material);
        zlGrid.position.set(
            BLOCK_SIZE / 2,
            -BLOCK_SIZE / 2,
            -((COLS - 1) * BLOCK_SIZE) / 2
        );
        const zrGrid = new THREE.LineSegments(edges, material);
        zrGrid.rotateY(THREE.MathUtils.degToRad(180));
        zrGrid.position.set(
            BLOCK_SIZE / 2,
            -BLOCK_SIZE / 2,
            ((COLS + 1) * BLOCK_SIZE) / 2
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

        game.board.forEachBlock((color, y, x, z) => {
            if (isCutOut(y, x, z)) return;
            const cube = color === "DELETE" ? createBloomingBlock() : createBlock(color)
            cube.position.set(translateX(x), translateY(y), translateZ(z));
            this._scene.add(cube);
        })

        game.ghostPiece.forEachBlock((y, x, z) => {
            const cube = createGhostBlock(game.ghostPiece.color)
            cube.position.set(translateX(x), translateY(y), translateZ(z));
            this._scene.add(cube)
        })

        game.piece.forEachBlock((y, x, z) => {
            const cube = createBlock(game.piece.color)
            cube.position.set(translateX(x), translateY(y), translateZ(z));
            this._scene.add(cube);

            const xrShadow = createShadow(game.piece.color)
            const xlShadow = createShadow(game.piece.color)
            const zlShadow = createShadow(game.piece.color)
            const zrShadow = createShadow(game.piece.color)

            xrShadow.rotateY(THREE.MathUtils.degToRad(-90))
            xlShadow.rotateY(THREE.MathUtils.degToRad(90))
            zrShadow.rotateY(THREE.MathUtils.degToRad(180))

            xrShadow.position.set(
                ((COLS + 1) * BLOCK_SIZE) / 2,
                translateY(y),
                translateZ(z)
            )
            xlShadow.position.set(
                -((COLS - 1) * BLOCK_SIZE) / 2,
                translateY(y),
                translateZ(z)
            )
            zlShadow.position.set(
                translateX(x),
                translateY(y),
                -((COLS - 1) * BLOCK_SIZE) / 2
            )
            zrShadow.position.set(
                translateX(x),
                translateY(y),
                ((COLS + 1) * BLOCK_SIZE) / 2
            )

            this._scene.add(xrShadow);
            this._scene.add(xlShadow);
            this._scene.add(zlShadow);
            this._scene.add(zrShadow);
        })

        const scoreHUD = createScoreHUD(progress.score)
        scoreHUD.position.set(
            -(COLS) * BLOCK_SIZE / 2,
            (ROWS - 3) * BLOCK_SIZE / 2,
            -(COLS - 1) * BLOCK_SIZE / 2
        );
        const levelHUD = createLevelHUD(progress.level)
        levelHUD.position.set(
            -(COLS) * BLOCK_SIZE / 2,
            (ROWS / 2) * BLOCK_SIZE / 2,
            -(COLS - 1) * BLOCK_SIZE / 2
        );
        this._scene.add(scoreHUD);
        this._scene.add(levelHUD);

        const holdHUD = createHoldHUD(
            game.hold.piece.shape,
            game.hold.piece.color,
            game.piece.isHoldable
        )
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