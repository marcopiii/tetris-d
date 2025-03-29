import * as THREE from "three";
import {createWord} from "./createWord";
import {createBlock} from "./createVoxel";

const LABEL_PIXEL_SIZE = 0.15;
const SCORE_PIXEL_SIZE = 0.25;

const LABEL_COLOR = "#78ABA8";

function colorMap(digit: number) {
    if (digit < 3) return "#F39E60";
    if (digit < 6) return "#E16A54";
    if (digit < 9) return "#9F5255";
    return "#7C444F";
}

export function createScoreHUD(score: number) {
    const labelGroup = createWord("SCORE", () => LABEL_COLOR, LABEL_PIXEL_SIZE, "right");
    const scoreGroup = createWord(score.toString(), colorMap, SCORE_PIXEL_SIZE, "right");

    const scoreHUD = new THREE.Group();
    labelGroup.position.set(0,0,0);
    scoreGroup.position.set(0, -9 * LABEL_PIXEL_SIZE, 0);
    scoreHUD.add(labelGroup);
    scoreHUD.add(scoreGroup);
    scoreHUD.rotateY(THREE.MathUtils.degToRad(180))
    return scoreHUD;
}

export function createLevelHUD(level: number) {
    const labelGroup = createWord("LEVEL", () => LABEL_COLOR, LABEL_PIXEL_SIZE, "right");
    const levelGroup = createWord(level.toString(), colorMap, SCORE_PIXEL_SIZE, "right");

    const levelHUD = new THREE.Group();
    labelGroup.position.set(0,0,0);
    levelGroup.position.set(0, -9 * LABEL_PIXEL_SIZE, 0);
    levelHUD.add(labelGroup);
    levelHUD.add(levelGroup);
    levelHUD.rotateY(THREE.MathUtils.degToRad(180))
    return levelHUD;
}

export function createHoldHUD(shape: number[][], color: string, available: boolean) {
    const labelGroup = createWord("HOLD", () => LABEL_COLOR, LABEL_PIXEL_SIZE);
    const holdGroup = new THREE.Group();
    shape.forEach((row, y) => {
        row.forEach((exists, x) => {
            if (exists) {
                const cube = createBlock(available ? color : "#cfcfcf");
                cube.position.set(x, -y, 0);
                holdGroup.add(cube);
            }
        })
    })

    const holdHUD = new THREE.Group();
    labelGroup.position.set(0,0,0);
    holdGroup.position.set(0.5, -12 * LABEL_PIXEL_SIZE, 0);
    holdHUD.add(labelGroup);
    holdHUD.add(holdGroup);
    holdHUD.rotateY(THREE.MathUtils.degToRad(-90))
    return holdHUD;
}