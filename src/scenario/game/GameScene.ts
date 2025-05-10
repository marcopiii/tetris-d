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
import { GameCamera } from './GameCamera';

export abstract class GameScene {
  static readonly center = new THREE.Vector3(0, 0, 0);
  static readonly offset = new THREE.Vector3(1 / 2, -1 / 2, 1 / 2);

  // translations from the board coord system to the scene coord system
  private translateX = (x: number) => x + GameScene.offset.x - COLS / 2;
  private translateY = (y: number) => -y + GameScene.offset.y + ROWS / 2;
  private translateZ = (z: number) => z + GameScene.offset.z - COLS / 2;

  protected readonly _scene: THREE.Scene;
  private readonly _tetrion: THREE.Group;
  private readonly _board: THREE.Group;
  private readonly _piece: THREE.Group;

  constructor(scene: THREE.Scene) {
    this._scene = scene;
    this._scene.clear();

    this._scene.fog = new THREE.Fog('black', 10, 40);

    this._tetrion = new THREE.Group();
    this._board = new THREE.Group();
    this._piece = new THREE.Group();
    this._scene.add(this._tetrion);
    this._scene.add(this._board);
    this._scene.add(this._piece);

    this.setupTetrion();
  }

  private setupTetrion() {
    this._scene.background = new THREE.Color('#b5c5d2');

    const yGrid = tetrionFloor();
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

    this._tetrion.add(yGrid);
    this._tetrion.add(xlGrid);
    this._tetrion.add(xrGrid);
    this._tetrion.add(zlGrid);
    this._tetrion.add(zrGrid);

    this._scene.add(this._tetrion);
  }

  protected innerUpdate(game: Game, camera: GameCamera) {
    this._board.clear();
    this._piece.clear();

    const isCutOut = (x: number, z: number) => {
      return game.piece.plane === 'x'
        ? (camera.cutter.below && x < game.piece.planePosition) ||
            (camera.cutter.above && x > game.piece.planePosition)
        : (camera.cutter.below && z < game.piece.planePosition) ||
            (camera.cutter.above && z > game.piece.planePosition);
    };

    if (camera.cutter.below) {
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
      this._board.add(belowCutShadow);
    }

    if (camera.cutter.above) {
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
      this._board.add(aboveCutShadow);
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
      this._board.add(mino);
    });

    game.ghostPiece.forEachBlock((y, x, z) => {
      // avoid overlapping with the piece
      let occupiedByPiece = false;
      game.piece.forEachBlock((py, px, pz) => {
        if (py === y && px === x && pz === z)
          occupiedByPiece = true;
      });
      if (occupiedByPiece) return;

      const mino = createGhostMino(game.ghostPiece.type);
      mino.position
        .add(GameScene.center)
        .add({
          x: this.translateX(x),
          y: this.translateY(y),
          z: this.translateZ(z),
        })
        .multiplyScalar(MINO_SIZE);
      this._piece.add(mino);
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
      this._piece.add(mino);

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

      this._piece.add(xrShadow);
      this._piece.add(xlShadow);
      this._piece.add(zlShadow);
      this._piece.add(zrShadow);
    });
  }
}
