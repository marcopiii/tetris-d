import { CameraPosition } from './PvPCameraManager';
import { COLS, ROWS, MINO_SIZE, VOXEL_SIZE } from '../../params';
import * as THREE from 'three';
import { createWord } from '../../scene/createWord';
import { Shape } from '../../scene/types';
import { Name as Tetrimino } from '../../tetrimino';
import type { PlayerTag, Player } from './PlayerManager';
import {
  createMino,
  createMinoShade,
  createBloomingMino,
  createGhostMino,
  createTetrionWall,
  tetrionFloor,
} from '../../scene/createMesh';
import type { Game } from './Game';
import type { Progress } from './Progress';
import { cuttingShadowMaterial } from '../../scene/assets/materials';
import { translateX, translateY, translateZ } from '../../scene/utils';

export class GameSceneManager {
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

  constructor(scene: THREE.Scene) {
    this._scene = scene;
    this._scene.clear();
    this.#config(this._scene);
    this._cutter = { below: false, above: false };
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
    cameraPosition: CameraPosition,
  ) {
    this._scene.clear();
    this.#config(this._scene);

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

    const hudP1 = createHUD(
      P1,
      progressP1,
      game.held,
      ['c1', 'c3'].includes(cameraPosition) ? 'right' : 'left',
      !P1.active,
    );
    if (cameraPosition === 'c1') {
      hudP1.position.set(
        (-COLS * MINO_SIZE) / 2,
        ((ROWS - 3) * MINO_SIZE) / 2,
        (-(COLS - 1) * MINO_SIZE) / 2,
      );
    } else if (cameraPosition === 'c2') {
      hudP1.position.set(
        ((COLS + 2) * MINO_SIZE) / 2,
        ((ROWS - 3) * MINO_SIZE) / 2,
        (-(COLS - 1) * MINO_SIZE) / 2,
      );
      hudP1.rotateY(THREE.MathUtils.degToRad(180));
    } else if (cameraPosition === 'c3') {
      hudP1.position.set(
        ((COLS + 1) * MINO_SIZE) / 2,
        ((ROWS - 3) * MINO_SIZE) / 2,
        ((COLS + 2) * MINO_SIZE) / 2,
      );
      hudP1.rotateY(THREE.MathUtils.degToRad(180));
    } else if (cameraPosition === 'c4') {
      hudP1.position.set(
        (-(COLS - 1) * MINO_SIZE) / 2,
        ((ROWS - 3) * MINO_SIZE) / 2,
        ((COLS + 2) * MINO_SIZE) / 2,
      );
    }
    this._scene.add(hudP1);

    const hudP2 = createHUD(
      P2,
      progressP2,
      game.held,
      ['c1', 'c3'].includes(cameraPosition) ? 'left' : 'right',
      !P2.active,
    );
    if (cameraPosition === 'c1') {
      hudP2.position.set(
        ((COLS + 1) * MINO_SIZE) / 2,
        ((ROWS - 3) * MINO_SIZE) / 2,
        ((COLS + 2) * MINO_SIZE) / 2,
      );
    } else if (cameraPosition === 'c2') {
      hudP2.position.set(
        (-(COLS - 1) * MINO_SIZE) / 2,
        ((ROWS - 3) * MINO_SIZE) / 2,
        ((COLS + 2) * MINO_SIZE) / 2,
      );
    } else if (cameraPosition === 'c3') {
      hudP2.position.set(
        (-COLS * MINO_SIZE) / 2,
        ((ROWS - 3) * MINO_SIZE) / 2,
        (-(COLS - 1) * MINO_SIZE) / 2,
      );
      hudP2.rotateY(THREE.MathUtils.degToRad(180));
    } else if (cameraPosition === 'c4') {
      hudP2.position.set(
        ((COLS + 2) * MINO_SIZE) / 2,
        ((ROWS - 3) * MINO_SIZE) / 2,
        (-(COLS - 1) * MINO_SIZE) / 2,
      );
      hudP2.rotateY(THREE.MathUtils.degToRad(180));
    }

    hudP2.rotateY(THREE.MathUtils.degToRad(90));
    this._scene.add(hudP2);
  }
}

function createScoreHUD(
  score: number,
  align: 'left' | 'right',
  disabled = false,
) {
  const labelGroup = createWord('score', 'secondary', align, disabled);
  const scoreGroup = createWord(score.toString(), 'primary', align, disabled);

  const scoreHUD = new THREE.Group();
  labelGroup.position.set(0, 0, 0);
  scoreGroup.position.set(0, -9 * VOXEL_SIZE.secondary, 0);
  scoreHUD.add(labelGroup);
  scoreHUD.add(scoreGroup);
  scoreHUD.rotateY(THREE.MathUtils.degToRad(180));
  return scoreHUD;
}

function createLevelHUD(
  level: number,
  align: 'left' | 'right',
  disabled = false,
) {
  const labelGroup = createWord('level', 'secondary', align, disabled);
  const levelGroup = createWord(level.toString(), 'primary', align, disabled);

  const levelHUD = new THREE.Group();
  labelGroup.position.set(0, 0, 0);
  levelGroup.position.set(0, -9 * VOXEL_SIZE.secondary, 0);
  levelHUD.add(labelGroup);
  levelHUD.add(levelGroup);
  levelHUD.rotateY(THREE.MathUtils.degToRad(180));
  return levelHUD;
}

function createHoldHUD(
  shape: Shape,
  type: Tetrimino,
  available: boolean,
  align: 'left' | 'right',
  disabled = false,
) {
  const labelGroup = createWord('hold', 'secondary', align, disabled);
  const holdGroup = new THREE.Group();
  shape.forEach((row, y) => {
    (align === 'left' ? row : row.toReversed()).forEach((exists, x) => {
      if (exists) {
        const cube = createMino(!disabled && available ? type : 'disabled');
        cube.position.set(x, -y, 0);
        holdGroup.add(cube);
      }
    });
  });

  const holdHUD = new THREE.Group();
  labelGroup.position.set(0, 0, 0);
  holdGroup.position.set(0.5, -12 * VOXEL_SIZE.secondary, 0);
  holdHUD.add(labelGroup);
  holdHUD.add(holdGroup);
  return holdHUD;
}

function createHUD(
  player: Player,
  progress: Progress,
  hold: { shape: Shape; type: Tetrimino; available: boolean },
  align: 'left' | 'right',
  disabled: boolean = false,
) {
  const hud = new THREE.Group();
  const handle = createWord(player.name, 'main', align, disabled);
  const score = createScoreHUD(progress.score, align, disabled);
  const level = createLevelHUD(progress.level, align, disabled);
  const held = createHoldHUD(
    hold.shape,
    hold.type,
    hold.available,
    align,
    disabled,
  );

  handle.position.set(0, 0, 0);
  handle.rotateY(THREE.MathUtils.degToRad(180));
  score.position.set(0, -VOXEL_SIZE.main * 7, 0);
  level.position.set(
    0,
    -(VOXEL_SIZE.main * 7 + VOXEL_SIZE.secondary * 8 + VOXEL_SIZE.primary * 8),
    0,
  );
  held.position.set(
    0,
    -(
      VOXEL_SIZE.main * 7 +
      VOXEL_SIZE.secondary * 8 +
      VOXEL_SIZE.primary * 8 +
      VOXEL_SIZE.secondary * 8 +
      VOXEL_SIZE.primary * 8
    ),
    0,
  );
  held.rotateY(THREE.MathUtils.degToRad(180));

  hud.add(handle);
  hud.add(score);
  hud.add(level);
  hud.add(held);
  return hud;
}
