export function keyboardLocalization(button: KeyboardEvent['code']): string {
  switch (button) {
    case 'Enter':
      return 'enter';
    case 'KeyA':
      return 'A';
    case 'KeyD':
      return 'D';
    case 'KeyS':
      return 'S';
    case 'KeyW':
      return 'W';
    case 'KeyQ':
      return 'Q';
    case 'KeyE':
      return 'E';
    case 'KeyX':
      return 'X';
    case 'ArrowLeft':
      return 'left';
    case 'ArrowRight':
      return 'right';
    case 'ArrowDown':
      return 'down';
    case 'ArrowUp':
      return 'up';
    case 'Space':
      return 'space';
    default:
      return button;
  }
}
