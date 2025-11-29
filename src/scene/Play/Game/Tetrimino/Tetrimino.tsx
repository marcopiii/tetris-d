import { clamp } from 'es-toolkit';
import React from 'react';
import { MinoCoord } from '~/scene/Play/Game/types';
import { LOCK_DELAY_MS, LockTimer } from '../gameplay';
import { COLS, VANISH_ZONE_ROWS } from '../params';
import Mino from '../Mino';
import { translate } from '../utils';
import MinoShade from './MinoShade';
import { Tetrimino as TetriminoType } from '~/tetrimino';
import { useFrame } from '@react-three/fiber';

type Props = {
  type: TetriminoType;
  occupiedBlocks: MinoCoord[];
  lockTimer: React.RefObject<LockTimer | undefined>;
  isPaused?: boolean;
};

export default function Tetrimino(props: Props) {
  const [lockProgress, setLockProgress] = React.useState(0);

  useFrame(() => {
    if (props.lockTimer.current) {
      const elapsed = performance.now() - props.lockTimer.current.t0;
      const progress = Math.min(elapsed / LOCK_DELAY_MS, 1);
      setLockProgress(progress);
    } else {
      setLockProgress(0);
    }
  });

  return (
    <group>
      {props.occupiedBlocks.map((minoCoord) => {
        const isInVanishZone = minoCoord.y < VANISH_ZONE_ROWS;
        return isInVanishZone ? (
          <MinoInVanishZone
            coord={minoCoord}
            type={props.type}
            isPaused={props.isPaused}
            lockProgress={lockProgress}
          />
        ) : (
          <MinoInWell
            coord={minoCoord}
            type={props.type}
            isPaused={props.isPaused}
            lockProgress={lockProgress}
          />
        );
      })}
    </group>
  );
}

function MinoInWell(props: {
  coord: Props['occupiedBlocks'][number];
  type: Props['type'];
  isPaused: Props['isPaused'];
  lockProgress: number;
}) {
  const { x, y, z } = props.coord;
  const [tx, ty, tz] = translate(x, y, z);

  const minoProps =
    props.lockProgress > 0
      ? {
          type: props.type,
          status: 'locking' as const,
          lockProgress: props.lockProgress,
        }
      : {
          type: props.type,
          status: props.isPaused ? ('disabled' as const) : ('normal' as const),
        };

  const shadeProps = props.isPaused
    ? { status: 'disabled' as const, type: props.type }
    : { status: 'normal' as const, type: props.type };

  return (
    <group>
      <Mino position={[tx, ty, tz]} {...minoProps} />
      <group>
        <MinoShade
          {...shadeProps}
          rotation={[0, 0, 0]}
          position={[tx, ty, -COLS / 2]}
        />
        <MinoShade
          {...shadeProps}
          rotation={[0, Math.PI / 2, 0]}
          position={[-COLS / 2, ty, tz]}
        />
        <MinoShade
          {...shadeProps}
          rotation={[0, Math.PI, 0]}
          position={[tx, ty, COLS / 2]}
        />
        <MinoShade
          {...shadeProps}
          rotation={[0, -Math.PI / 2, 0]}
          position={[COLS / 2, ty, tz]}
        />
      </group>
    </group>
  );
}

function MinoInVanishZone(props: {
  coord: Props['occupiedBlocks'][number];
  type: Props['type'];
  isPaused: Props['isPaused'];
  lockProgress: number;
}) {
  const { x, y, z } = props.coord;

  const k = 0.25;
  const fragmentsOffsets: [number, number, number][] = [
    [+k, +k, +k],
    [+k, +k, -k],
    [+k, -k, +k],
    [+k, -k, -k],
    [-k, +k, +k],
    [-k, +k, -k],
    [-k, -k, +k],
    [-k, -k, -k],
  ];

  const s0 = 0.8;
  const sf = 0.55;
  const t = clamp(y, 0, VANISH_ZONE_ROWS) / VANISH_ZONE_ROWS;
  const shrink = s0 + (sf - s0) * t;

  const minoProps =
    props.lockProgress > 0
      ? {
          type: props.type,
          status: 'locking' as const,
          lockProgress: props.lockProgress,
          shrink,
        }
      : {
          type: props.type,
          status: props.isPaused ? ('disabled' as const) : ('normal' as const),
          shrink,
        };

  const fragments = fragmentsOffsets.map(([ox, oy, oz]) => {
    const [tx, ty, tz] = translate(x + ox, y + oy, z + oz);
    return <Mino position={[tx, ty, tz]} {...minoProps} />;
  });

  return <group>{fragments}</group>;
}
