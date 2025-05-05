import { Menu } from '../../menu';

export class MainMenu extends Menu {
  constructor(onPvE: () => void, onControls: () => void, onAbout: () => void) {
    super([
      { name: 'single', action: onPvE },
      { name: 'controls', action: onControls },
      { name: 'about', action: onAbout },
    ]);
  }
}
