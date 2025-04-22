import { GameCamera, GameCameraPosition } from './GameCamera';
import { COLS, ROWS, MINO_SIZE, VOXEL_SIZE } from '../../params';
import * as THREE from 'three';
import { createWord } from '../../scene/createWord';
import { Shape, Name as Tetrimino } from '../../tetrimino';
import type { PlayerTag, Player } from './PlayerManager';
import { createMino } from '../../scene/createMesh';
import type { Game } from './Game';
import type { Progress } from './Progress';
import { GameScene } from './GameScene';
import * as F from '../../scene/font';

export class PvPScene extends GameScene {
  private readonly _hud: THREE.Group;

  constructor(scene: THREE.Scene) {
    super(scene);
    this._hud = new THREE.Group();
    this._scene.add(this._hud);
  }

  update(
    game: Game,
    progressP1: Progress,
    progressP2: Progress,
    players: Record<PlayerTag, Player>,
    camera: GameCamera,
  ) {
    this.innerUpdate(game, camera);
    this._hud.clear();

    const { P1, P2 } = players;

    const hudP1 = createHUD(
      P1,
      progressP1,
      game.held,
      ['c1', 'c3'].includes(camera.position) ? 'right' : 'left',
      !P1.active,
    );
    if (camera.position === 'c1') {
      hudP1.position
        .add(GameScene.center)
        .add({ x: -(COLS + 1) / 2, y: (ROWS - 2) / 2, z: -COLS / 2 })
        .multiplyScalar(MINO_SIZE);
    } else if (camera.position === 'c2') {
      hudP1.position
        .add(GameScene.center)
        .add({ x: (COLS + 1) / 2, y: (ROWS - 2) / 2, z: -COLS / 2 })
        .multiplyScalar(MINO_SIZE);
      hudP1.rotateY(THREE.MathUtils.degToRad(180));
    } else if (camera.position === 'c3') {
      hudP1.position
        .add(GameScene.center)
        .add({ x: COLS / 2, y: (ROWS - 2) / 2, z: (COLS + 1) / 2 })
        .multiplyScalar(MINO_SIZE);
      hudP1.rotateY(THREE.MathUtils.degToRad(180));
    } else if (camera.position === 'c4') {
      hudP1.position
        .add(GameScene.center)
        .add({ x: -COLS / 2, y: (ROWS - 2) / 2, z: (COLS + 1) / 2 })
        .multiplyScalar(MINO_SIZE);
    }
    this._hud.add(hudP1);

    const hudP2 = createHUD(
      P2,
      progressP2,
      game.held,
      ['c1', 'c3'].includes(camera.position) ? 'left' : 'right',
      !P2.active,
    );
    if (camera.position === 'c1') {
      hudP2.position
        .add(GameScene.center)
        .add({ x: COLS / 2, y: (ROWS - 2) / 2, z: (COLS + 1) / 2 })
        .multiplyScalar(MINO_SIZE);
    } else if (camera.position === 'c2') {
      hudP2.position
        .add(GameScene.center)
        .add({ x: -COLS / 2, y: (ROWS - 2) / 2, z: (COLS + 1) / 2 })
        .multiplyScalar(MINO_SIZE);
    } else if (camera.position === 'c3') {
      hudP2.position
        .add(GameScene.center)
        .add({ x: -(COLS + 1) / 2, y: (ROWS - 2) / 2, z: -COLS / 2 })
        .multiplyScalar(MINO_SIZE);
      hudP2.rotateY(THREE.MathUtils.degToRad(180));
    } else if (camera.position === 'c4') {
      hudP2.position
        .add(GameScene.center)
        .add({ x: (COLS + 1) / 2, y: (ROWS - 2) / 2, z: -COLS / 2 })
        .multiplyScalar(MINO_SIZE);
      hudP2.rotateY(THREE.MathUtils.degToRad(180));
    }

    hudP2.rotateY(THREE.MathUtils.degToRad(90));
    this._hud.add(hudP2);
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

function createHoldHUD(
  shape: F.Char,
  type: Tetrimino,
  available: boolean,
  align: 'left' | 'right',
  disabled = false,
) {
  const labelGroup = createWord(F.alphabet)(
    'hold',
    'secondary',
    align,
    disabled,
  );
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
  const handle = createWord(F.alphabet)(player.name, 'main', align, disabled);
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
