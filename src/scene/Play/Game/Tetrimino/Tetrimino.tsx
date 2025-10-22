import React from 'react';
import { LOCK_DELAY_MS, LockTimer } from '../gameplay';
import { COLS } from '../params';
import Mino from '../Mino';
import { translate } from '../utils';
import MinoShade from './MinoShade';
import { Tetrimino as TetriminoType } from '~/tetrimino';
import { useFrame } from '@react-three/fiber';

type Props = {
  type: TetriminoType;
  occupiedBlocks: { y: number; x: number; z: number }[];
  lockTimer: React.RefObject<LockTimer | undefined>;
};

export default function Tetrimino(props: Props) {
  //todo(marco): change appearance of the blocks in the vanish zone

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
      : { status: 'normal' as const };

  return (
    <group>
      {props.occupiedBlocks.map(({ y, x, z }) => {
        const [tx, ty, tz] = translate(x, y, z);
        return (
          <>
            <Mino type={props.type} position={[tx, ty, tz]} {...minoProps} />
            <MinoShade
              type={props.type}
              rotation={[0, 0, 0]}
              position={[tx, ty, -COLS / 2]}
            />
            <MinoShade
              type={props.type}
              rotation={[0, Math.PI / 2, 0]}
              position={[-COLS / 2, ty, tz]}
            />
            <MinoShade
              type={props.type}
              rotation={[0, Math.PI, 0]}
              position={[tx, ty, COLS / 2]}
            />
            <MinoShade
              type={props.type}
              rotation={[0, -Math.PI / 2, 0]}
              position={[COLS / 2, ty, tz]}
            />
          </>
        );
      })}
    </group>
  );
}
