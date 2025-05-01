import { Menu } from '../../menu';

export class MainMenu extends Menu {
  constructor(onPvE: () => void, onAbout: () => void) {
    super([
      { name: 'single', action: onPvE },
      { name: 'about', action: onAbout },
    ]);
  }
}
