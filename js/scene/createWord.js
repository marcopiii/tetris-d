import * as THREE from "three";
import {createVoxel} from "./createVoxel";
import {font} from "./font";

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

export function createWord(word: string, colorMap, pixelSize, align = "left") {
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