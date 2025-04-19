import { Menu } from '../../menu';

export class MainMenu extends Menu {
  constructor(onPvE: () => void, onPvP: () => void, onAbout: () => void) {
    super([
      { name: 'single', action: onPvE },
      { name: '1v1', action: onPvP },
      { name: 'about', action: onAbout },
    ]);
  }
}
