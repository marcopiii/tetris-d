import { COLS, ROWS, MINO_SIZE } from '../../params';
import * as THREE from 'three';
import {
  createMino,
  createMinoShade,
  createBloomingMino,
  createGhostMino,
  createTetrionWall,
  tetrionFloor,
} from '../../scene/createMesh';
import type { Game } from './Game';
import { cuttingShadowMaterial } from '../../scene/assets/materials';

export abstract class GameScene {
  static readonly center = new THREE.Vector3(0, 0, 0);
  static readonly offset = new THREE.Vector3(1 / 2, -1 / 2, 1 / 2);

  // translations from the board coord system to the scene coord system
  private translateX = (x: number) => x + GameScene.offset.x - COLS / 2;
  private translateY = (y: number) => -y + GameScene.offset.y + ROWS / 2;
  private translateZ = (z: number) => z + GameScene.offset.z - COLS / 2;

  protected readonly _scene: THREE.Scene;
  private _cutter: { below: boolean; above: boolean };

  private config(scene: THREE.Scene) {
    scene.background = new THREE.Color('#b5c5d2');

    const yGrid = tetrionFloor;
    yGrid.position
      .add(GameScene.center)
      .add({ x: 0, y: -ROWS / 2, z: 0 })
      .multiplyScalar(MINO_SIZE);

    const xlGrid = createTetrionWall();
    xlGrid.rotateY(THREE.MathUtils.degToRad(90));
    xlGrid.position
      .add(GameScene.center)
      .add({ x: COLS / 2, y: 0, z: 0 })
      .multiplyScalar(MINO_SIZE);
    const xrGrid = createTetrionWall();
    xrGrid.rotateY(THREE.MathUtils.degToRad(-90));
    xrGrid.position
      .add(GameScene.center)
      .add({ x: -COLS / 2, y: 0, z: 0 })
      .multiplyScalar(MINO_SIZE);

    const zlGrid = createTetrionWall();
    zlGrid.position
      .add(GameScene.center)
      .add({ x: 0, y: 0, z: -COLS / 2 })
      .multiplyScalar(MINO_SIZE);
    const zrGrid = createTetrionWall();
    zrGrid.rotateY(THREE.MathUtils.degToRad(180));
    zrGrid.position
      .add(GameScene.center)
      .add({ x: 0, y: 0, z: COLS / 2 })
      .multiplyScalar(MINO_SIZE);

    scene.add(yGrid);
    scene.add(xlGrid);
    scene.add(xrGrid);
    scene.add(zlGrid);
    scene.add(zrGrid);
  }

  constructor(scene: THREE.Scene) {
    this._scene = scene;
    this._scene.clear();
    this.config(this._scene);
    this._cutter = { below: false, above: false };
  }

  set cutter(cutter: {
    below: boolean | undefined;
    above: boolean | undefined;
  }) {
    this._cutter = {
      below: cutter.below ?? this._cutter.below,
      above: cutter.above ?? this._cutter.above,
    };
  }

  protected innerUpdate(game: Game) {
    this._scene.clear();
    this.config(this._scene);

    const isCutOut = (x: number, z: number) => {
      return game.piece.plane === 'x'
        ? (this._cutter.below && x < game.piece.planePosition) ||
            (this._cutter.above && x > game.piece.planePosition)
        : (this._cutter.below && z < game.piece.planePosition) ||
            (this._cutter.above && z > game.piece.planePosition);
    };

    if (this._cutter.below) {
      const belowCutShadow = new THREE.Mesh(
        new THREE.PlaneGeometry(
          COLS * MINO_SIZE,
          game.piece.planePosition * MINO_SIZE,
        ),
        cuttingShadowMaterial,
      );
      if (game.piece.plane === 'x') {
        belowCutShadow.rotateZ(THREE.MathUtils.degToRad(90));
        belowCutShadow.rotateY(THREE.MathUtils.degToRad(90));
        belowCutShadow.position
          .add(GameScene.center)
          .add({ x: (game.piece.planePosition - COLS) / 2, y: -ROWS / 2, z: 0 })
          .multiplyScalar(MINO_SIZE);
      } else {
        belowCutShadow.rotateX(THREE.MathUtils.degToRad(-90));
        belowCutShadow.position
          .add(GameScene.center)
          .add({ x: 0, y: -ROWS / 2, z: (game.piece.planePosition - COLS) / 2 })
          .multiplyScalar(MINO_SIZE);
      }
      this._scene.add(belowCutShadow);
    }

    if (this._cutter.above) {
      const aboveCutShadow = new THREE.Mesh(
        new THREE.PlaneGeometry(
          COLS * MINO_SIZE,
          (COLS - 1 - game.piece.planePosition) * MINO_SIZE,
        ),
        cuttingShadowMaterial,
      );
      if (game.piece.plane === 'x') {
        aboveCutShadow.rotateZ(THREE.MathUtils.degToRad(90));
        aboveCutShadow.rotateY(THREE.MathUtils.degToRad(90));
        aboveCutShadow.position
          .add(GameScene.center)
          .add({ x: (game.piece.planePosition + 1) / 2, y: -ROWS / 2, z: 0 })
          .multiplyScalar(MINO_SIZE);
      } else {
        aboveCutShadow.rotateX(THREE.MathUtils.degToRad(-90));
        aboveCutShadow.position
          .add(GameScene.center)
          .add({ x: 0, y: -ROWS / 2, z: (game.piece.planePosition + 1) / 2 })
          .multiplyScalar(MINO_SIZE);
      }
      this._scene.add(aboveCutShadow);
    }

    game.board.forEachBlock((type, y, x, z) => {
      if (isCutOut(x, z)) return;
      const mino = type === 'DELETE' ? createBloomingMino() : createMino(type);
      mino.position
        .add(GameScene.center)
        .add({
          x: this.translateX(x),
          y: this.translateY(y),
          z: this.translateZ(z),
        })
        .multiplyScalar(MINO_SIZE);
      this._scene.add(mino);
    });

    game.ghostPiece.forEachBlock((y, x, z) => {
      const mino = createGhostMino(game.ghostPiece.type);
      mino.position
        .add(GameScene.center)
        .add({
          x: this.translateX(x),
          y: this.translateY(y),
          z: this.translateZ(z),
        })
        .multiplyScalar(MINO_SIZE);
      this._scene.add(mino);
    });

    game.piece.forEachBlock((y, x, z) => {
      const mino = createMino(game.piece.type);
      mino.position
        .add(GameScene.center)
        .add({
          x: this.translateX(x),
          y: this.translateY(y),
          z: this.translateZ(z),
        })
        .multiplyScalar(MINO_SIZE);
      this._scene.add(mino);

      const xrShadow = createMinoShade(game.piece.type);
      const xlShadow = createMinoShade(game.piece.type);
      const zlShadow = createMinoShade(game.piece.type);
      const zrShadow = createMinoShade(game.piece.type);

      xrShadow.rotateY(THREE.MathUtils.degToRad(-90));
      xlShadow.rotateY(THREE.MathUtils.degToRad(90));
      zrShadow.rotateY(THREE.MathUtils.degToRad(180));

      xrShadow.position
        .add(GameScene.center)
        .add({ x: COLS / 2, y: this.translateY(y), z: this.translateZ(z) })
        .multiplyScalar(MINO_SIZE);
      xlShadow.position
        .add(GameScene.center)
        .add({ x: -COLS / 2, y: this.translateY(y), z: this.translateZ(z) })
        .multiplyScalar(MINO_SIZE);
      zlShadow.position
        .add(GameScene.center)
        .add({ x: this.translateX(x), y: this.translateY(y), z: -COLS / 2 })
        .multiplyScalar(MINO_SIZE);
      zrShadow.position
        .add(GameScene.center)
        .add({ x: this.translateX(x), y: this.translateY(y), z: COLS / 2 })
        .multiplyScalar(MINO_SIZE);

      this._scene.add(xrShadow);
      this._scene.add(xlShadow);
      this._scene.add(zlShadow);
      this._scene.add(zrShadow);
    });

  }
}