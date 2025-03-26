import * as THREE from "three";
import {createWord} from "./createWord";

const LABEL_PIXEL_SIZE = 0.15;
const SCORE_PIXEL_SIZE = 0.25;

function colorMap(digit: number) {
    if (digit < 3) return "#F39E60";
    if (digit < 6) return "#E16A54";
    if (digit < 9) return "#9F5255";
    return "#7C444F";
}

export function createScoreHUD(score: number) {
    const labelGroup = createWord("SCORE", () => "#78ABA8", LABEL_PIXEL_SIZE, "right");
    const scoreGroup = createWord(score.toString(), colorMap, SCORE_PIXEL_SIZE, "right");

    const scoreboard = new THREE.Group();
    labelGroup.position.set(0,0,0);
    scoreGroup.position.set(0, -9 * LABEL_PIXEL_SIZE, 0);
    scoreboard.add(labelGroup);
    scoreboard.add(scoreGroup);
    scoreboard.rotateY(THREE.MathUtils.degToRad(180))
    return scoreboard;
}

export function createLevelHUD(level: number) {
    const labelGroup = createWord("LEVEL", () => "#78ABA8", LABEL_PIXEL_SIZE);
    const levelGroup = createWord(level.toString(), colorMap, SCORE_PIXEL_SIZE);

    const levelboard = new THREE.Group();
    labelGroup.position.set(0,0,0);
    levelGroup.position.set(0, -9 * LABEL_PIXEL_SIZE, 0);
    levelboard.add(labelGroup);
    levelboard.add(levelGroup);
    levelboard.rotateY(THREE.MathUtils.degToRad(-90))
    return levelboard;
}