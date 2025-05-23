import { play } from '../utils';
import FX from '../audio';

type MenuItem<T = never> = {
  name: string;
  accessory?: T;
  action: () => void;
  terminal?: boolean;
};

export class Menu<T = never> {
  protected _items: MenuItem<T>[] = [];
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
    bounded ? play(FX.menu_nav_ko, 0.5) : play(FX.menu_nav_ok, 0.5);
  }

  select(): boolean {
    const op = this._items[this._selectedIndex];
    op?.action();
    return op?.terminal ?? false;
  }

  get options() {
    return this._items.map((o, i) => ({
      label: o.name,
      accessory: o.accessory,
      selected: i === this._selectedIndex,
    }));
  }
}
