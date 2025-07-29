import React from 'react';
import FX from '../audio';
import { COLS, ROWS } from '../params';
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

  const detectCollision = React.useCallback(() => {
    const boardOccupiedCoords = boardManager.flatMapBlocks(
      (_, y, x, z) => [y, x, z] as const,
    );
    const tetriminoOccupiedCoords = tetriminoManager.flatMapBlocks(
      (y, x, z) => [y, x, z] as const,
    );
    const floorCollision = tetriminoOccupiedCoords.some(
      ([y, x, z]) => y >= ROWS,
    );
    const wallCollision = tetriminoOccupiedCoords.some(
      ([y, x, z]) => x < 0 || x >= COLS || z < 0 || z >= COLS,
    );
    const stackCollision = tetriminoOccupiedCoords.some(([ty, tx, tz]) =>
      boardOccupiedCoords.some(
        ([by, bx, bz]) => ty === by && tx === bx && tz === bz,
      ),
    );
    return floorCollision || wallCollision || stackCollision;
  }, [boardManager.flatMapBlocks, tetriminoManager.flatMapBlocks]);

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
