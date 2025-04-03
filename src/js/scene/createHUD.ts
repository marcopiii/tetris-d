import * as THREE from "three";
import {createWord} from "./createWord";
import {createMino} from "./createMesh";
import {VOXEL_SIZE} from "../params";
import {Shape} from "./types";
import { Name as Tetrimino} from "../tetrimino"

export function createScoreHUD(score: number) {
    const labelGroup = createWord("SCORE", "secondary", "right");
    const scoreGroup = createWord(score.toString(), "primary", "right");

    const scoreHUD = new THREE.Group();
    labelGroup.position.set(0,0,0);
    scoreGroup.position.set(0, -9 * VOXEL_SIZE.secondary, 0);
    scoreHUD.add(labelGroup);
    scoreHUD.add(scoreGroup);
    scoreHUD.rotateY(THREE.MathUtils.degToRad(180))
    return scoreHUD;
}

export function createLevelHUD(level: number) {
    const labelGroup = createWord("LEVEL", "secondary", "right");
    const levelGroup = createWord(level.toString(), "primary", "right");

    const levelHUD = new THREE.Group();
    labelGroup.position.set(0,0,0);
    levelGroup.position.set(0, -9 * VOXEL_SIZE.secondary, 0);
    levelHUD.add(labelGroup);
    levelHUD.add(levelGroup);
    levelHUD.rotateY(THREE.MathUtils.degToRad(180))
    return levelHUD;
}

export function createHoldHUD(shape: Shape, type: Tetrimino, available: boolean) {
    const labelGroup = createWord("HOLD", "secondary");
    const holdGroup = new THREE.Group();
    shape.forEach((row, y) => {
        row.forEach((exists, x) => {
            if (exists) {
                const cube = createMino(available ? type : "disabled");
                cube.position.set(x, -y, 0);
                holdGroup.add(cube);
            }
        })
    })

    const holdHUD = new THREE.Group();
    labelGroup.position.set(0,0,0);
    holdGroup.position.set(0.5, -12 * VOXEL_SIZE.secondary, 0);
    holdHUD.add(labelGroup);
    holdHUD.add(holdGroup);
    holdHUD.rotateY(THREE.MathUtils.degToRad(-90))
    return holdHUD;
}