import * as THREE from 'three';
import type {Board} from "../models/3DBoard";
import {SceneManager} from "./SceneManager";

/**
 * Applies the Board state to the Scene
 * @param board
 * @param scene
 */
export function render(board: Board, scene: SceneManager) {
    const BLOCK_SIZE = 1;
    const geometry = new THREE.BoxGeometry(BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);

    scene.reset();

    board.forEachBlock((color, y, x, z) => {
        if (color) {
            const material = new THREE.MeshBasicMaterial({ color });
            const cube = new THREE.Mesh(geometry, material);
            cube.position.set(x * BLOCK_SIZE, y * BLOCK_SIZE, z * BLOCK_SIZE);
            scene.addMesh(cube)
        }
    })
}