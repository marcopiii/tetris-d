import { Menu } from './Menu';

export class GameMenu extends Menu {
  constructor(onResume: () => void, onExit: () => void) {
    super([
      { name: 'resume', action: onResume },
      { name: 'exit', action: onExit },
    ]);
  }
}
