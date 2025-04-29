import { GameCamera } from './GameCamera';
import { COLS, ROWS, MINO_SIZE, VOXEL_SIZE } from '../../params';
import * as THREE from 'three';
import { createWord } from '../../scene/createWord';
import { Shape, Name as Tetrimino } from '../../tetrimino';
import { createMino } from '../../scene/createMesh';
import type { Game } from './Game';
import type { Progress } from './Progress';
import { GameScene } from './GameScene';
import * as F from '../../scene/font';

export class PvEScene extends GameScene {
  private readonly _hud: THREE.Group;

  constructor(scene: THREE.Scene) {
    super(scene);
    this._hud = new THREE.Group();
    this._scene.add(this._hud);
  }

  update(game: Game, progress: Progress, camera: GameCamera) {
    this.innerUpdate(game, camera);
    this._hud.clear();

    const hudProgress = createProgressHUD(progress, 'right');
    const hudPiece = createPieceHUD(game.next, game.held, 'left');

    if (camera.position === 'c1') {
      hudProgress.position
        .add(GameScene.center)
        .add({ x: -(COLS + 1) / 2, y: (ROWS - 2) / 2, z: -COLS / 2 })
        .multiplyScalar(MINO_SIZE);
      hudPiece.position
        .add(GameScene.center)
        .add({ x: COLS / 2, y: (ROWS - 2) / 2, z: (COLS + 1) / 2 })
        .multiplyScalar(MINO_SIZE);
      hudPiece.rotateY(THREE.MathUtils.degToRad(-90));
    } else if (camera.position === 'c2') {
      hudProgress.position
        .add(GameScene.center)
        .add({ x: -COLS / 2, y: (ROWS - 2) / 2, z: (COLS + 1) / 2 })
        .multiplyScalar(MINO_SIZE);
      hudProgress.rotateY(THREE.MathUtils.degToRad(90));
      hudPiece.position
        .add(GameScene.center)
        .add({ x: (COLS + 1) / 2, y: (ROWS - 2) / 2, z: -COLS / 2 })
        .multiplyScalar(MINO_SIZE);
    } else if (camera.position === 'c3') {
      hudProgress.position
        .add(GameScene.center)
        .add({ x: COLS / 2, y: (ROWS - 2) / 2, z: (COLS + 1) / 2 })
        .multiplyScalar(MINO_SIZE);
      hudProgress.rotateY(THREE.MathUtils.degToRad(180));
      hudPiece.position
        .add(GameScene.center)
        .add({ x: -(COLS + 1) / 2, y: (ROWS - 2) / 2, z: -COLS / 2 })
        .multiplyScalar(MINO_SIZE);
      hudPiece.rotateY(THREE.MathUtils.degToRad(90));
    } else if (camera.position === 'c4') {
      hudProgress.position
        .add(GameScene.center)
        .add({ x: (COLS + 1) / 2, y: (ROWS - 2) / 2, z: -COLS / 2 })
        .multiplyScalar(MINO_SIZE);
      hudProgress.rotateY(THREE.MathUtils.degToRad(-90));
      hudPiece.position
        .add(GameScene.center)
        .add({ x: -COLS / 2, y: (ROWS - 2) / 2, z: (COLS + 1) / 2 })
        .multiplyScalar(MINO_SIZE);
      hudPiece.rotateY(THREE.MathUtils.degToRad(-180));
    }

    this._hud.add(hudProgress);
    this._hud.add(hudPiece);
  }
}

function createScoreHUD(
  score: number,
  align: 'left' | 'right',
  disabled = false,
) {
  const labelGroup = createWord(F.alphabet)(
    'score',
    'secondary',
    align,
    disabled,
  );
  const scoreGroup = createWord(F.numbers)(
    score.toString(),
    'primary',
    align,
    disabled,
  );

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
  const labelGroup = createWord(F.alphabet)(
    'level',
    'secondary',
    align,
    disabled,
  );
  const levelGroup = createWord(F.numbers)(
    level.toString(),
    'primary',
    align,
    disabled,
  );

  const levelHUD = new THREE.Group();
  labelGroup.position.set(0, 0, 0);
  levelGroup.position.set(0, -9 * VOXEL_SIZE.secondary, 0);
  levelHUD.add(labelGroup);
  levelHUD.add(levelGroup);
  levelHUD.rotateY(THREE.MathUtils.degToRad(180));
  return levelHUD;
}

function createPreviewHUD(
  shape: F.Char,
  type: Tetrimino,
  align: 'left' | 'right',
  disabled = false,
) {
  const labelGroup = createWord(F.alphabet)(
    'next',
    'secondary',
    align,
    disabled,
  );
  const nextGroup = new THREE.Group();
  shape.forEach((row, y) => {
    (align === 'left' ? row : row.toReversed()).forEach((exists, x) => {
      if (exists) {
        const cube = createMino(!disabled ? type : 'disabled');
        cube.position.set(x, -y, 0);
        nextGroup.add(cube);
      }
    });
  });

  const nextHUD = new THREE.Group();
  labelGroup.position.set(0, 0, 0);
  nextGroup.position.set(0.5, -12 * VOXEL_SIZE.secondary, 0);
  nextHUD.add(labelGroup);
  nextHUD.add(nextGroup);
  return nextHUD;
}

function createHoldHUD(
  shape: Shape,
  type: Tetrimino,
  available: boolean,
  align: 'left' | 'right',
) {
  const labelGroup = createWord(F.alphabet)('hold', 'secondary', align);
  const holdGroup = new THREE.Group();
  shape.forEach((row, y) => {
    (align === 'left' ? row : row.toReversed()).forEach((exists, x) => {
      if (exists) {
        const cube = createMino(available ? type : 'disabled');
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

function createPieceHUD(
  next: { shape: Shape; type: Tetrimino },
  hold: { shape: Shape; type: Tetrimino; available: boolean },
  align: 'left' | 'right',
) {
  const previewHUD = createPreviewHUD(next.shape, next.type, align);
  const holdHUD = createHoldHUD(hold.shape, hold.type, hold.available, align);

  holdHUD.position.set(
    0,
    -(VOXEL_SIZE.secondary * 11 + VOXEL_SIZE.primary * 11),
    0,
  );

  const group = new THREE.Group();
  group.add(previewHUD);
  group.add(holdHUD);

  return group;
}

function createProgressHUD(progress: Progress, align: 'left' | 'right') {
  const hud = new THREE.Group();
  const score = createScoreHUD(progress.score, align);
  const level = createLevelHUD(progress.level, align);

  score.position.set(0, 0, 0);
  level.position.set(
    0,
    -(VOXEL_SIZE.secondary * 8 + VOXEL_SIZE.primary * 8),
    0,
  );

  hud.add(score);
  hud.add(level);

  return hud;
}
