import React from 'react';
import { COLS } from '~/scene/Play/Game/params';
import Mino from '../Mino';
import { translate } from '../utils';
import MinoShade from './MinoShade';
import { Tetrimino as TetriminoType } from '~/tetrimino';
import { useFrame } from '@react-three/fiber';

type Props = {
  type: TetriminoType;
  occupiedBlocks: { y: number; x: number; z: number }[];
  locking?: NodeJS.Timeout;
};

export default function Tetrimino(props: Props) {
  //todo(marco): change appearance of the blocks in the vanish zone

  const [lockProgress, setLockProgress] = React.useState<number | undefined>(
    undefined,
  );
  const lockStartRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    if (props.locking) {
      lockStartRef.current = performance.now();
      setLockProgress(0);
    } else {
      lockStartRef.current = null;
      setLockProgress(undefined);
    }
  }, [props.locking]);

  useFrame(() => {
    if (lockStartRef.current !== null) {
      const elapsed = performance.now() - lockStartRef.current;
      const progress = Math.min(elapsed / 500, 1);
      setLockProgress(progress);
    }
  });

  const minoProps = lockProgress
    ? {
        status: 'locking' as const,
        lockProgress: lockProgress,
      }
    : {
        status: 'normal' as const,
      };

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
