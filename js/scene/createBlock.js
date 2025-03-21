import * as THREE from "three";

function adjustBrightness(hex, factor) {
  const rgb = parseInt(hex.slice(1), 16);
  const r = Math.min(255, Math.max(0, ((rgb >> 16) & 0xff) + factor));
  const g = Math.min(255, Math.max(0, ((rgb >> 8) & 0xff) + factor));
  const b = Math.min(255, Math.max(0, (rgb & 0xff) + factor));
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

function planesColors(original) {
  const factor = 20;
  const variant1 = adjustBrightness(original, factor);
  const variant2 = adjustBrightness(original, -factor);
  return [original, variant1, variant2];
}

function getMeshMaterials(color) {
  const [colorX, colorY, colorZ] = planesColors(color);

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