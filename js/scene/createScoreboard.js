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

export function createScoreboard(score: number) {
    const chars = score.toString().split('');
    const charShapes= chars.map(char => font[char])

    const scoreGroup = new THREE.Group();
    charShapes.toReversed().forEach((shape, i) => {
        const charGroup = new THREE.Group();
        shape.map((row, y) => {
            row.toReversed().map((pixel, x) => {
                if (pixel) {
                    const color = colorMap(i)
                    const voxel = createVoxel(color, SCORE_PIXEL_SIZE)
                    voxel.position.set(x * SCORE_PIXEL_SIZE, -y * SCORE_PIXEL_SIZE, 0);
                    charGroup.add(voxel);
                }
            })
        })
        charGroup.position.set(i * 4 * SCORE_PIXEL_SIZE, 0, 0);
        scoreGroup.add(charGroup);
    })

    const labelGroup = new THREE.Group();
    "SCORE".split('')
        .map(char => font[char])
        .toReversed().forEach((shape, i ) => {
            const charGroup = new THREE.Group();
            shape.map((row, y) => {
                row.toReversed().map((pixel, x) => {
                    if (pixel) {
                        const color = "#78ABA8";
                        const voxel = createVoxel(color, LABEL_PIXEL_SIZE);
                        voxel.position.set(x * LABEL_PIXEL_SIZE, -y * LABEL_PIXEL_SIZE, 0);
                        charGroup.add(voxel);
                    }
                })
            })
            charGroup.position.set(i * 6 * LABEL_PIXEL_SIZE, 0, 0);
            labelGroup.add(charGroup);
        });

    const scoreboard = new THREE.Group();
    labelGroup.position.set(0,0,0);
    scoreGroup.position.set(0, -6 * LABEL_PIXEL_SIZE, 0);
    scoreboard.add(labelGroup);
    scoreboard.add(scoreGroup);
    return scoreboard;
}