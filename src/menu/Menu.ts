import { play } from '../utils';

const menu_nav_ok = require('../audio/menu_nav_ok.mp3');
const menu_nav_ko = require('../audio/menu_nav_ko.mp3');

type MenuItem = {
  name: string;
  action: () => void;
};

export class Menu {
  private _items: MenuItem[] = [];
  private _selectedIndex: number = 0;

  constructor(items: MenuItem[]) {
    this._items = items;
  }

  navigate(direction: 'up' | 'down'): void {
    const [i, bounded] =
      direction === 'up'
        ? this._selectedIndex - 1 < 0
          ? [0, true]
          : [this._selectedIndex - 1, false]
        : this._selectedIndex + 1 > this._items.length - 1
          ? [this._items.length - 1, true]
          : [this._selectedIndex + 1, false];
    this._selectedIndex = i;
    bounded ? play(menu_nav_ko, 0.5) : play(menu_nav_ok, 0.5);
  }

  select(): void {
    this._items[this._selectedIndex]?.action();
  }

  get options() {
    return this._items.map((o, i) => ({
      label: o.name,
      selected: i === this._selectedIndex,
    }));
  }
}
