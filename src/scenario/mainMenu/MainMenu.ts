import { Menu } from '../../menu';

export class MainMenu extends Menu {
  constructor(onPvE: () => void, onPvP: () => void, onExit: () => void) {
    super([
      { name: 'single', action: onPvE },
      { name: '1v1', action: onPvP },
      { name: 'credits', action: () => {} },
      { name: 'exit', action: onExit },
    ]);
  }
}
