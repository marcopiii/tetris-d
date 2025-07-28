import React from 'react';
import { Piece } from '../scenario/game/Piece';
import Board from './Board';
import Tetrimino from './Tetrimino';
import Tetrion from './Tetrion';
import useBoardManager from './useBoardManager';

export default function Game() {
  const boardManager = useBoardManager();

  return (
    <group>
      <Tetrion />
      <Board boardMatrix={boardManager.matrix} />
      <Tetrimino tetrimino={new Piece('S', 'z')} />
    </group>
  );
}
