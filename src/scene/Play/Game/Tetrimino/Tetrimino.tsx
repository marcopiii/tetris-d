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

  const minoProps =
    lockProgress > 0
      ? { status: 'locking' as const, lockProgress }
      : {
          status: props.isPaused ? ('disabled' as const) : ('normal' as const),
        };

  const shadeProps = props.isPaused
    ? { status: 'disabled' as const, type: props.type }
    : { status: 'normal' as const, type: props.type };

  return (
    <group>
      {props.occupiedBlocks.map(({ y, x, z }) => {
        const isInVanishZone = y < VANISH_ZONE_ROWS;
        const [tx, ty, tz] = translate(x, y, z);
        return (
          <>
            <Mino type={props.type} position={[tx, ty, tz]} {...minoProps} />
            {!isInVanishZone && (
              <>
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
              </>
            )}
          </>
        );
      })}
    </group>
  );
}
