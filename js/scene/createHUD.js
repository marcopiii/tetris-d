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

export function createScoreHUD(score: number) {
    const chars = score.toString().split('');
    const charShapes= chars.map(char => font[char])

    const scoreGroup = new THREE.Group();
    charShapes.toReversed().forEach((shape, i) => {
        const charGroup = createChar(shape, colorMap(i), SCORE_PIXEL_SIZE, "right");
        charGroup.position.set(i * 4 * SCORE_PIXEL_SIZE, 0, 0);
        scoreGroup.add(charGroup);
    })

    const labelGroup = new THREE.Group();
    "SCORE".split('')
        .map(char => font[char])
        .toReversed().forEach((shape, i ) => {
            const charGroup = createChar(shape, "#78ABA8", LABEL_PIXEL_SIZE, "right");
            charGroup.position.set(i * 6 * LABEL_PIXEL_SIZE, 0, 0);
            labelGroup.add(charGroup);
        });

    const scoreboard = new THREE.Group();
    labelGroup.position.set(0,0,0);
    scoreGroup.position.set(0, -8 * LABEL_PIXEL_SIZE, 0);
    scoreboard.add(labelGroup);
    scoreboard.add(scoreGroup);
    scoreboard.rotateY(THREE.MathUtils.degToRad(180))
    return scoreboard;
}

export function createLevelHUD(level: number) {
    const chars = level.toString().split('');
    const charShapes = chars.map(char => font[char])

    const levelGroup = new THREE.Group();
    charShapes.forEach((shape, i) => {
        const charGroup = createChar(shape, colorMap(i), SCORE_PIXEL_SIZE);
        levelGroup.position.set(i * 4 * SCORE_PIXEL_SIZE, 0, 0);
        levelGroup.add(charGroup);
    })

    const labelGroup = new THREE.Group();
    "LEVEL".split('')
        .map(char => font[char])
        .forEach((shape, i ) => {
        const charGroup = createChar(shape, "#78ABA8", LABEL_PIXEL_SIZE);
        charGroup.position.set(i * 6 * LABEL_PIXEL_SIZE, 0, 0);
        labelGroup.add(charGroup);
    });

    const levelboard = new THREE.Group();
    labelGroup.position.set(0,0,0);
    levelGroup.position.set(0, -8 * LABEL_PIXEL_SIZE, 0);
    levelboard.add(labelGroup);
    levelboard.add(levelGroup);
    levelboard.rotateY(THREE.MathUtils.degToRad(-90))
    return levelboard;
}