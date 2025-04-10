import { MenuItem } from './types';

export class Menu {
  private _items: MenuItem[] = [];
  private _selectedIndex: number = 0;

  constructor(items: MenuItem[]) {
    this._items = items;
  }

  navigate(direction: 'up' | 'down'): void {
    if (direction === 'up') {
      this._selectedIndex = Math.max(0, this._selectedIndex - 1);
    } else if (direction === 'down') {
      this._selectedIndex = Math.min(
        this._items.length - 1,
        this._selectedIndex + 1,
      );
    }
  }

  select(): void {
    this._items[this._selectedIndex]?.action();
  }
}
