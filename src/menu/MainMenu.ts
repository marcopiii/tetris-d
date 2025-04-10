import { Menu } from './Menu';

export class MainMenu extends Menu {
  constructor(onStart: () => void, onExit: () => void) {
    super([
      { name: '1v1', action: onStart },
      { name: 'Exit', action: onExit },
    ]);
  }
}
