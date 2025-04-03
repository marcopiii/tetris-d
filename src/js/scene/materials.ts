import * as THREE from "three";
import {tetrimino} from "../pieces/tetrimino";
import {adjustBrightness as adj} from "./adjustBrightness";

const k = 20;
const j = 80;

export const minoMaterials = {
    I: {
        x: new THREE.MeshBasicMaterial({color: tetrimino.I.color}),
        y: new THREE.MeshBasicMaterial({color: adj(tetrimino.I.color, k)}),
        z: new THREE.MeshBasicMaterial({color: adj(tetrimino.I.color, -k)})
    },
    O: {
        x: new THREE.MeshBasicMaterial({color: tetrimino.O.color}),
        y: new THREE.MeshBasicMaterial({color: adj(tetrimino.O.color, k)}),
        z: new THREE.MeshBasicMaterial({color: adj(tetrimino.O.color, -k)})
    },
    T: {
        x: new THREE.MeshBasicMaterial({color: tetrimino.T.color}),
        y: new THREE.MeshBasicMaterial({color: adj(tetrimino.T.color, k)}),
        z: new THREE.MeshBasicMaterial({color: adj(tetrimino.T.color, -k)})
    },
    J: {
        x: new THREE.MeshBasicMaterial({color: tetrimino.J.color}),
        y: new THREE.MeshBasicMaterial({color: adj(tetrimino.J.color, k)}),
        z: new THREE.MeshBasicMaterial({color: adj(tetrimino.J.color, -k)})
    },
    L: {
        x: new THREE.MeshBasicMaterial({color: tetrimino.L.color}),
        y: new THREE.MeshBasicMaterial({color: adj(tetrimino.L.color, k)}),
        z: new THREE.MeshBasicMaterial({color: adj(tetrimino.L.color, -k)})
    },
    S: {
        x: new THREE.MeshBasicMaterial({color: tetrimino.S.color}),
        y: new THREE.MeshBasicMaterial({color: adj(tetrimino.S.color, k)}),
        z: new THREE.MeshBasicMaterial({color: adj(tetrimino.S.color, -k)})
    },
    Z: {
        x: new THREE.MeshBasicMaterial({color: tetrimino.Z.color}),
        y: new THREE.MeshBasicMaterial({color: adj(tetrimino.Z.color, k)}),
        z: new THREE.MeshBasicMaterial({color: adj(tetrimino.Z.color, -k)})
    },
    disabled: {
        x: new THREE.MeshBasicMaterial({color: "#cfcfcf"}),
        y: new THREE.MeshBasicMaterial({color: adj("#cfcfcf", k)}),
        z: new THREE.MeshBasicMaterial({color: adj("#cfcfcf", -k)})
    }
}

export const minoShadeMaterials = {
    I: new THREE.MeshBasicMaterial({color: adj(tetrimino.I.color, -j) }),
    O: new THREE.MeshBasicMaterial({color: adj(tetrimino.O.color, -j) }),
    T: new THREE.MeshBasicMaterial({color: adj(tetrimino.T.color, -j) }),
    J: new THREE.MeshBasicMaterial({color: adj(tetrimino.J.color, -j) }),
    L: new THREE.MeshBasicMaterial({color: adj(tetrimino.L.color, -j) }),
    S: new THREE.MeshBasicMaterial({color: adj(tetrimino.S.color, -j) }),
    Z: new THREE.MeshBasicMaterial({color: adj(tetrimino.Z.color, -j) })
}

export const minoTransMaterials = {
    I: new THREE.MeshBasicMaterial({ color: tetrimino.I.color, transparent: true, opacity: 0.5 }),
    O: new THREE.MeshBasicMaterial({ color: tetrimino.O.color, transparent: true, opacity: 0.5 }),
    T: new THREE.MeshBasicMaterial({ color: tetrimino.T.color, transparent: true, opacity: 0.5 }),
    J: new THREE.MeshBasicMaterial({ color: tetrimino.J.color, transparent: true, opacity: 0.5 }),
    L: new THREE.MeshBasicMaterial({ color: tetrimino.L.color, transparent: true, opacity: 0.5 }),
    S: new THREE.MeshBasicMaterial({ color: tetrimino.S.color, transparent: true, opacity: 0.5 }),
    Z: new THREE.MeshBasicMaterial({ color: tetrimino.Z.color, transparent: true, opacity: 0.5 })
}

export const voxelMaterials = {
    primary: {
        x: new THREE.MeshBasicMaterial({color: "#F39E60"}),
        y: new THREE.MeshBasicMaterial({color: adj("#F39E60", k)}),
        z: new THREE.MeshBasicMaterial({color: adj("#F39E60", -k)})
    },
    secondary: {
        x: new THREE.MeshBasicMaterial({color: "#78ABA8"}),
        y: new THREE.MeshBasicMaterial({color: adj("#78ABA8", k)}),
        z: new THREE.MeshBasicMaterial({color: adj("#78ABA8", -k)})
    }
}

export const bloomingMaterial = new THREE.MeshBasicMaterial({ color: new THREE.Color(1.01, 1.01,1.01) })

export const tetrionMaterial = new THREE.LineBasicMaterial({ color: "#8797a4", transparent: true, opacity: 0.5 });

export const cuttingShadowMaterial = new THREE.MeshBasicMaterial({ color: "#808080" });