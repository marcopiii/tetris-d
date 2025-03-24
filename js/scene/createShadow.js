import {BLOCK_SIZE} from "../params";
import * as THREE from "three";
import {adjustBrightness} from "./adjustBrightness";

export function createShadow(color) {
    const shadowColor = adjustBrightness(color, -80)
    const geometry = new THREE.PlaneGeometry(BLOCK_SIZE, BLOCK_SIZE);
    const materials = new THREE.MeshBasicMaterial({color: shadowColor})
    return new THREE.Mesh(geometry, materials);
}