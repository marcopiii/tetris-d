import { COLS, ROWS, MINO_SIZE } from '../params';
import * as THREE from 'three';
import { PlayerTag } from '../player';
import { Player } from '../player/types';
import {
  createMino,
  createMinoShade,
  createBloomingMino,
  createGhostMino,
  createTetrionWall,
  tetrionFloor,
} from './createMesh';
import { createHUD } from './createHUD';
import type { Game, Progress } from '../gameplay';
import { cuttingShadowMaterial } from './assets/materials';
import { createWord } from './createWord';
import { translateX, translateY, translateZ } from './utils';

export class SceneManager {
  private readonly _scene: THREE.Scene;
  private _cutter: { below: boolean; above: boolean };

  #config(scene: THREE.Scene) {
    scene.background = new THREE.Color('#b5c5d2');

    const yGrid = tetrionFloor;
    yGrid.position.set(MINO_SIZE / 2, -(ROWS + MINO_SIZE) / 2, MINO_SIZE / 2);

    const xlGrid = createTetrionWall();
    xlGrid.rotateY(THREE.MathUtils.degToRad(90));
    xlGrid.position.set(
      ((COLS + 1) * MINO_SIZE) / 2,
      -MINO_SIZE / 2,
      MINO_SIZE / 2,
    );
    const xrGrid = createTetrionWall();
    xrGrid.rotateY(THREE.MathUtils.degToRad(-90));
    xrGrid.position.set(
      -((COLS - 1) * MINO_SIZE) / 2,
      -MINO_SIZE / 2,
      MINO_SIZE / 2,
    );

    const zlGrid = createTetrionWall();
    zlGrid.position.set(
      MINO_SIZE / 2,
      -MINO_SIZE / 2,
      -((COLS - 1) * MINO_SIZE) / 2,
    );
    const zrGrid = createTetrionWall();
    zrGrid.rotateY(THREE.MathUtils.degToRad(180));
    zrGrid.position.set(
      MINO_SIZE / 2,
      -MINO_SIZE / 2,
      ((COLS + 1) * MINO_SIZE) / 2,
    );

    scene.add(yGrid);
    scene.add(xlGrid);
    scene.add(xrGrid);
    scene.add(zlGrid);
    scene.add(zrGrid);
  }

  constructor() {
    this._scene = new THREE.Scene();
    this._cutter = { below: false, above: false };
    this.#config(this._scene);
  }

  reset() {
    this._scene.clear();
    this.#config(this._scene);
  }

  get scene() {
    return this._scene;
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

  update(
    game: Game,
    progressP1: Progress,
    progressP2: Progress,
    players: Record<PlayerTag, Player>,
  ) {
    this.reset();

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
        belowCutShadow.position.set(
          ((game.piece.planePosition - COLS + 1) * MINO_SIZE) / 2,
          -(ROWS + MINO_SIZE) / 2,
          MINO_SIZE / 2,
        );
      } else {
        belowCutShadow.rotateX(THREE.MathUtils.degToRad(-90));
        belowCutShadow.position.set(
          MINO_SIZE / 2,
          -(ROWS + MINO_SIZE) / 2,
          ((game.piece.planePosition - COLS + 1) * MINO_SIZE) / 2,
        );
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
        aboveCutShadow.position.set(
          ((game.piece.planePosition + 2) * MINO_SIZE) / 2,
          -(ROWS + MINO_SIZE) / 2,
          MINO_SIZE / 2,
        );
      } else {
        aboveCutShadow.rotateX(THREE.MathUtils.degToRad(-90));
        aboveCutShadow.position.set(
          MINO_SIZE / 2,
          -(ROWS + MINO_SIZE) / 2,
          ((game.piece.planePosition + 2) * MINO_SIZE) / 2,
        );
      }
      this._scene.add(aboveCutShadow);
    }

    game.board.forEachBlock((type, y, x, z) => {
      if (isCutOut(x, z)) return;
      const mino = type === 'DELETE' ? createBloomingMino() : createMino(type);
      mino.position.set(translateX(x), translateY(y), translateZ(z));
      this._scene.add(mino);
    });

    game.ghostPiece.forEachBlock((y, x, z) => {
      const mino = createGhostMino(game.ghostPiece.type);
      mino.position.set(translateX(x), translateY(y), translateZ(z));
      this._scene.add(mino);
    });

    game.piece.forEachBlock((y, x, z) => {
      const mino = createMino(game.piece.type);
      mino.position.set(translateX(x), translateY(y), translateZ(z));
      this._scene.add(mino);

      const xrShadow = createMinoShade(game.piece.type);
      const xlShadow = createMinoShade(game.piece.type);
      const zlShadow = createMinoShade(game.piece.type);
      const zrShadow = createMinoShade(game.piece.type);

      xrShadow.rotateY(THREE.MathUtils.degToRad(-90));
      xlShadow.rotateY(THREE.MathUtils.degToRad(90));
      zrShadow.rotateY(THREE.MathUtils.degToRad(180));

      xrShadow.position.set(
        ((COLS + 1) * MINO_SIZE) / 2,
        translateY(y),
        translateZ(z),
      );
      xlShadow.position.set(
        -((COLS - 1) * MINO_SIZE) / 2,
        translateY(y),
        translateZ(z),
      );
      zlShadow.position.set(
        translateX(x),
        translateY(y),
        -((COLS - 1) * MINO_SIZE) / 2,
      );
      zrShadow.position.set(
        translateX(x),
        translateY(y),
        ((COLS + 1) * MINO_SIZE) / 2,
      );

      this._scene.add(xrShadow);
      this._scene.add(xlShadow);
      this._scene.add(zlShadow);
      this._scene.add(zrShadow);
    });

    const { P1, P2 } = players;

    const hudP1 = createHUD(P1, progressP1, 'right', !P1.active);
    hudP1.position.set(
      (-COLS * MINO_SIZE) / 2,
      ((ROWS - 3) * MINO_SIZE) / 2,
      (-(COLS - 1) * MINO_SIZE) / 2,
    );
    this._scene.add(hudP1);

    const hudP2 = createHUD(P2, progressP2, 'left', !P2.active);
    hudP2.position.set(
      ((COLS + 1) * MINO_SIZE) / 2,
      ((ROWS - 3) * MINO_SIZE) / 2,
      ((COLS + 2) * MINO_SIZE) / 2,
    );
    hudP2.rotateY(THREE.MathUtils.degToRad(90));
    this._scene.add(hudP2);
  }
}
