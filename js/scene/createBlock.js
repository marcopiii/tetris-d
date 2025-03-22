import * as THREE from "three";
import {adjustBrightness} from "./adjustBrightness";

function getMeshMaterials(color) {
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

export function createBlock(color, blockSize) {
  const geometry = new THREE.BoxGeometry(blockSize, blockSize, blockSize);
  const materials = getMeshMaterials(color)
  return new THREE.Mesh(geometry, materials);
}