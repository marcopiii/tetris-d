export type PlayerTag = 'P1' | 'P2';
export type Player = { name: string; active: boolean };

export class PlayerManager {
  private _activePlayer: PlayerTag;
  private readonly _players: { P1: string; P2: string };

  constructor(p1: string, p2: string) {
    this._activePlayer = 'P1';
    this._players = { P1: p1, P2: p2 };
  }

  get activePlayer(): PlayerTag {
    return this._activePlayer;
  }

  get players(): Record<PlayerTag, Player> {
    return {
      P1: { name: this._players.P1, active: this._activePlayer === 'P1' },
      P2: { name: this._players.P2, active: this._activePlayer === 'P2' },
    };
  }

  switchPlayer() {
    this._activePlayer = this._activePlayer === 'P1' ? 'P2' : 'P1';
  }
}
