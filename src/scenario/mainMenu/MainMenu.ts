import { Menu } from '../../menu';

export class MainMenu extends Menu {
  constructor(onPvE: () => void, onControls: () => void, onAbout: () => void) {
    super([
      { name: 'single', action: onPvE, terminal: true },
      { name: 'controls', action: onControls, terminal: true },
      { name: 'about', action: onAbout, terminal: true },
    ]);
  }
}
