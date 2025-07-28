import React from 'react';
import Board from './Board';
import Tetrimino from './Tetrimino';
import Tetrion from './Tetrion';
import useBoardManager from './useBoardManager';
import useTetriminoManager from './useTetriminoManager';
import { Name as TetriminoType } from '../tetrimino/types';

export default function Game() {
  const [{ type, plane }, setCurrentTetrimino] = React.useState({
    type: 'S' as TetriminoType,
    plane: 'z' as 'x' | 'z',
  });

  const boardManager = useBoardManager();
  const tetriminoManager = useTetriminoManager(type, plane);

  return (
    <group>
      <Tetrion />
      <Board matrixIterator={boardManager.flatMapBlocks} />
      <Tetrimino type={'S'} matrixIterator={tetriminoManager.flatMapBlocks} />
    </group>
  );
}
