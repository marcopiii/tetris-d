import * as THREE from "three";
import {adjustBrightness} from "./adjustBrightness";

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

function getBloomingMaterial() {
  const bloom = new THREE.Color(1.01, 1.01,1.01)
  return new THREE.MeshBasicMaterial({ color: bloom })
}

export function createVoxel(color, size) {
  const geometry = new THREE.BoxGeometry(size, size, size);
  const material = color === "DELETE"
        ? getBloomingMaterial()
        : getFakeShadedMaterial(color);
  return new THREE.Mesh(geometry, material);
}