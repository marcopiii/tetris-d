import { Player } from './types';

export class PlayerManager {
  private _activePlayer: Player;

  constructor() {
    this._activePlayer = 'P1';
  }

  get activePlayer(): Player {
    return this._activePlayer;
  }

  switchPlayer() {
    this._activePlayer = this._activePlayer === 'P1' ? 'P2' : 'P1';
  }
}
