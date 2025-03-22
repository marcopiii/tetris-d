import * as THREE from "three";
import {adjustBrightness} from "./adjustBrightness";

export function createShadow(color, blockSize) {
    const shadowColor = adjustBrightness(color, -80)
    const geometry = new THREE.PlaneGeometry(blockSize, blockSize);
    const materials = new THREE.MeshBasicMaterial({color: shadowColor})
    return new THREE.Mesh(geometry, materials);
}