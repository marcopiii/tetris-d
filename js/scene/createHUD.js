import * as THREE from "three";
import {font} from "./font";
import {createVoxel} from "./createVoxel";

const LABEL_PIXEL_SIZE = 0.15;
const SCORE_PIXEL_SIZE = 0.25;

function colorMap(digit: number) {
    if (digit < 3) return "#F39E60";
    if (digit < 6) return "#E16A54";
    if (digit < 9) return "#9F5255";
    return "#7C444F";
}

function createChar(shape, color, pixelSize, align = "left") {
    const charGroup = new THREE.Group();
    shape.map((row, y) => {
        (align === "left" ? row : row.toReversed()).map((pixel, x) => {
            if (pixel) {
                const voxel = createVoxel(color, pixelSize)
                voxel.position.set(x * pixelSize, -y * pixelSize, 0);
                charGroup.add(voxel);
            }
        })
    })
    return charGroup
}

function createWord(word: string, colorMap, pixelSize, align = "left") {
    const shapes = word.split('').map(char => font[char]);
    const wordGroup = new THREE.Group();
    let offset = 0;
    (align === "left" ? shapes : shapes.toReversed()).forEach((shape, i) => {
        const charGroup = createChar(shape, colorMap(i), pixelSize, align);
        charGroup.position.set(offset * pixelSize, 0, 0);
        wordGroup.add(charGroup);
        offset += shape[0].length + 1;
    })
    return wordGroup;
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