import * as THREE from "three";
import {adjustBrightness} from "./adjustBrightness";
import {BLOCK_SIZE} from "../params";

function getFakeShadedMaterial(color) {
  const factor = 20;

  const colorX = color
  const colorY = adjustBrightness(color, factor)
  const colorZ = adjustBrightness(color, -factor);

  const xMeshMaterial = new THREE.MeshBasicMaterial({color: colorX});
  const yMeshMaterial = new THREE.MeshBasicMaterial({color: colorY});
  const zMeshMaterial = new THREE.MeshBasicMaterial({color: colorZ});

  return [
    xMeshMaterial, // Right face
    xMeshMaterial, // Left face
    yMeshMaterial, // Top face
    yMeshMaterial, // Bottom face
    zMeshMaterial, // Front face
    zMeshMaterial  // Back face
  ];
}

const blockGeometry = new THREE.BoxGeometry(BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);

export function createBlock(color) {
  const geometry = blockGeometry;
  const material = getFakeShadedMaterial(color)
  return new THREE.Mesh(geometry, material);
}

export function createGhostBlock(color) {
  const geometry = blockGeometry;
  const material = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.5 });
  return new THREE.Mesh(geometry, material);
}

export function createBloomingBlock() {
  const geometry = blockGeometry;
  const material = new THREE.MeshBasicMaterial({ color: new THREE.Color(1.01, 1.01,1.01) })
  return new THREE.Mesh(geometry, material);
}

export function createVoxel(color, size) {
  const geometry = new THREE.BoxGeometry(size, size, size);
  const material = getFakeShadedMaterial(color)
  return new THREE.Mesh(geometry, material);
}