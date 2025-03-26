import * as THREE from "three";
import {font} from "./font";
import {createVoxel} from "./createVoxel";

const PIXEL_SIZE = 0.25;

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
                    const voxel = createVoxel(color, PIXEL_SIZE)
                    voxel.position.set(x * PIXEL_SIZE, -y * PIXEL_SIZE, 0);
                    charGroup.add(voxel);
                }
            })
        })
        charGroup.position.set(i * 4 * PIXEL_SIZE, 0, 0);
        scoreGroup.add(charGroup);
    })
    return scoreGroup;
}