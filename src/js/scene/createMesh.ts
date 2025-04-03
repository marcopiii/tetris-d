import * as THREE from "three";
import {minoGeometry, minoShadeGeometry, tetrionWallGeometry, voxelGeometries} from "./geometries";
import {
  bloomingMaterial,
  minoMaterials,
  minoShadeMaterials,
  minoTransMaterials,
  tetrionMaterial,
  voxelMaterials
} from "./materials";
import {COLS, MINO_SIZE} from "../params";
import { Name as Tetrimino} from "../tetrimino"

export function createMino(type: Tetrimino) {
  const { x, y, z } = minoMaterials[type]
  return new THREE.Mesh(minoGeometry, [x, x, y, y, z, z]);
}

export function createGhostMino(type: Tetrimino) {
  return new THREE.Mesh(minoGeometry, minoTransMaterials[type]);
}

export function createBloomingMino() {
  return new THREE.Mesh(minoGeometry, bloomingMaterial);
}

export function createMinoShade(type: Tetrimino) {
  return new THREE.Mesh(minoShadeGeometry, minoShadeMaterials[type]);
}

export function createVoxel(size: "primary" | "secondary") {
  const { x, y, z, } = voxelMaterials[size]
  return new THREE.Mesh(voxelGeometries[size], [x, x, y, y, z, z]);
}

export const tetrionFloor = new THREE.GridHelper(
    COLS * MINO_SIZE, COLS, "#8797a4", "#8797a4"
);

export function createTetrionWall() {
  return new THREE.LineSegments(tetrionWallGeometry, tetrionMaterial);
}