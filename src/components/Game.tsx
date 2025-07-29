import React from 'react';
import FX from '../audio';
import { LineCoord } from '../scenario/game/types';
import { play } from '../utils';
import Board from './Board';
import Tetrimino from './Tetrimino';
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

  const boardManager = useBoardManager();
  const tetriminoManager = useTetriminoManager(type, plane);

  function detectCollision(): boolean {
    // todo: implement collision detection
    return false;
  }

  const tick = (): [LineCoord[], boolean] => {
    const needRecheck = boardManager.clearLines();
    const cascadeLineClear = needRecheck ? boardManager.checkLines() : [];
    if (cascadeLineClear.length > 0) {
      play(FX.line_clear, 0.75);
      return [cascadeLineClear, false];
    }
    tetriminoManager.drop();
    if (detectCollision()) {
      tetriminoManager.rollback();
      boardManager.fixPiece(type, tetriminoManager.flatMapBlocks);
      const lineClear = boardManager.checkLines();
      if (lineClear.length > 0) {
        play(FX.line_clear, 0.75);
      }
      setCurrentTetrimino((prevTetrimino) => ({
        type: 'Z', // todo: replace with logic to get next tetrimino type
        plane: prevTetrimino.plane === 'x' ? 'z' : 'x',
      }));
      // onNewPiece();
      const gameOver = detectCollision();
      return [lineClear, gameOver];
    }
    return [[], false];
  };

  useClock(tick);

  // todo: avoid unnecessary re-renders
  return (
    <group>
      <Tetrion />
      <Board matrixIterator={boardManager.flatMapBlocks} />
      <Tetrimino type={type} matrixIterator={tetriminoManager.flatMapBlocks} />
    </group>
  );
}
