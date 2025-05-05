import { play } from '../utils';

const menu_nav_ok = require('../audio/menu_nav_ok.mp3');
const menu_nav_ko = require('../audio/menu_nav_ko.mp3');

type MenuItem<T = never> = {
  name: string;
  accessory?: T;
  action: () => void;
};

export class Menu<T = never> {
  private _items: MenuItem<T>[] = [];
  private _selectedIndex: number = 0;

  constructor(items: MenuItem<T>[]) {
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
      accessory: o.accessory,
      selected: i === this._selectedIndex,
    }));
  }
}
