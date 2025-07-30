import React from 'react';
import FX from '../audio';
import { COLS, ROWS } from '../params';
import { LineCoord } from '../scenario/game/types';
import { play } from '../utils';
import Board from './Board';
import Tetrimino from './Tetrimino';
import { drop } from './tetriminoMovement';
import Tetrion from './Tetrion';
import useBoardManager from './useBoardManager';
import { useClock } from './useClock';
import useTetriminoManager from './useTetriminoManager';
import { Name as TetriminoType } from '../tetrimino/types';

export default function Game() {
  const [{ type, plane }, setCurrentTetrimino] = React.useState({
    type: 'S' as TetriminoType,
    plane: 'z' as 'x' | 'z',
  });

  const { board, checkLines, clearLines, fixPiece } = useBoardManager();
  const { tetrimino, attempt } = useTetriminoManager(type, plane);

  const tick = (): [LineCoord[], boolean] => {
    const needRecheck = clearLines();
    const cascadeLineClear = needRecheck ? checkLines() : [];
    if (cascadeLineClear.length > 0) {
      play(FX.line_clear, 0.75);
      return [cascadeLineClear, false];
    }

    const collision = !attempt(drop)(board);

    if (collision) {
      fixPiece(type, board);
      const lineClear = checkLines();
      if (lineClear.length > 0) {
        play(FX.line_clear, 0.75);
      }
      setCurrentTetrimino((prevTetrimino) => ({
        type: 'Z', // todo: replace with logic to get next tetrimino type
        plane: prevTetrimino.plane === 'x' ? 'z' : 'x',
      }));
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
      <Tetrimino type={type} occupiedBlocks={tetrimino} />
    </group>
  );
}
