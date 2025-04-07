import * as THREE from 'three';
import { Progress } from '../gameplay';
import { Player } from '../player';
import { createWord } from './createWord';
import { createMino } from './createMesh';
import { VOXEL_SIZE } from '../params';
import { Shape } from './types';
import { Name as Tetrimino } from '../tetrimino';

function createScoreHUD(
  score: number,
  align: 'left' | 'right',
  disabled = false,
) {
  const labelGroup = createWord('SCORE', 'secondary', align, disabled);
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
  const labelGroup = createWord('LEVEL', 'secondary', align, disabled);
  const levelGroup = createWord(level.toString(), 'primary', align, disabled);

  const levelHUD = new THREE.Group();
  labelGroup.position.set(0, 0, 0);
  levelGroup.position.set(0, -9 * VOXEL_SIZE.secondary, 0);
  levelHUD.add(labelGroup);
  levelHUD.add(levelGroup);
  levelHUD.rotateY(THREE.MathUtils.degToRad(180));
  return levelHUD;
}

function createHoldHUD(shape: Shape, type: Tetrimino, available: boolean, align: 'left' | 'right', disabled = false) {
  const labelGroup = createWord('HOLD', 'secondary', align, disabled);
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

export function createHUD(
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
  const held = createHoldHUD(hold.shape, hold.type, hold.available, align, disabled);

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
