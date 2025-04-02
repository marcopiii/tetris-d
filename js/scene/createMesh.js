import * as THREE from "three";
import {minoGeometry, minoShadeGeometry, voxelGeometries} from "./geometries";
import {bloomingMaterial, minoMaterials, minoShadeMaterials, minoTransMaterials, voxelMaterials} from "./materials";

export function createMino(type) {
  const { x, y, z } = minoMaterials[type]
  return new THREE.Mesh(minoGeometry, [x, x, y, y, z, z]);
}

export function createGhostMino(type) {
  return new THREE.Mesh(minoGeometry, minoTransMaterials[type]);
}

export function createBloomingMino() {
  return new THREE.Mesh(minoGeometry, bloomingMaterial);
}

export function createMinoShade(type) {
  return new THREE.Mesh(minoShadeGeometry, minoShadeMaterials[type]);
}

export function createVoxel(size: "primary" | "secondary") {
  const { x, y, z, } = voxelMaterials[size]
  return new THREE.Mesh(voxelGeometries[size], [x, x, y, y, z, z]);
}