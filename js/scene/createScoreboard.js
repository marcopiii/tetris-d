import * as THREE from "three";
import {font} from "./font";
import {createVoxel} from "./createVoxel";

const PIXEL_SIZE = 0.3;

export function createScoreboard(score: number) {
    const chars = score.toString().split('');
    const charShapes= chars.map(char => font[char])

    const scoreGroup = new THREE.Group();
    charShapes.forEach((shape, i) => {
        const charGroup = new THREE.Group();
        shape.map((row, y) => {
            row.map((pixel, x) => {
                if (pixel) {
                    const voxel = createVoxel("#ffffff", PIXEL_SIZE)
                    voxel.position.set(x * PIXEL_SIZE, -y * PIXEL_SIZE, 0);
                    charGroup.add(voxel);
                }
            })
        })
        charGroup.position.set(i * 5 * PIXEL_SIZE, 0, 0);
        scoreGroup.add(charGroup);
    })
    return scoreGroup;
}