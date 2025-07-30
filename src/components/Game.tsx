import React from 'react';
import { LineCoord } from '../scenario/game/types';
import Board from './Board';
import Tetrimino from './Tetrimino';
import { drop } from './tetriminoMovement';
import Tetrion from './Tetrion';
import useBag from './useBag';
import useBoardManager from './useBoardManager';
import useClock from './useClock';
import usePlane from './usePlane';
import useTetriminoManager from './useTetriminoManager';

export default function Game() {
  const plane = usePlane();
  const bag = useBag();

  const { board, fixPiece } = useBoardManager();
  const { tetrimino, attempt } = useTetriminoManager(
    bag.current,
    plane.current,
  );

  const tick = (): [LineCoord[], boolean] => {
    // const needRecheck = clearLines();
    // const cascadeLineClear = needRecheck ? checkLines() : [];
    // if (cascadeLineClear.length > 0) {
    //   play(FX.line_clear, 0.75);
    //   return [cascadeLineClear, false];
    // }

    const collision = !attempt(drop)(board);

    if (collision) {
      fixPiece(tetrimino);
      const lineClear: LineCoord[] = []; //checkLines();
      // if (lineClear.length > 0) {
      //   play(FX.line_clear, 0.75);
      // }
      bag.pullNext();
      plane.change();
      // onNewPiece();
      const gameOver = false; // detectCollision(); todo: implement game over logic
      return [lineClear, gameOver];
    }
    return [[], false];
  };

  useClock(tick);

  // todo: avoid unnecessary re-renders
  return (
    <group>
      <Tetrion />
      <Board occupiedBlocks={board} />
      <Tetrimino occupiedBlocks={tetrimino} />
    </group>
  );
}
