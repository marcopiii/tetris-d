import { useFrame } from '@react-three/fiber';
import React from 'react';
import { Button } from '../gamepad';
import { mapping } from '../gamepad/mapping';

type Event = 'press' | 'hold' | 'release' | 'lift';

const HOLD_FRAMES = 12;
const BUFFER_SIZE = HOLD_FRAMES + 1;

export default function useGamepadManager(
  handler: (event: Event, button: Button) => void,
) {
  const bufferRef = React.useRef<GamepadButton[][]>([]);

  const poll = React.useCallback(() => {
    const gamepad = navigator.getGamepads()[0];
    if (!gamepad) return;

    gamepad.buttons.forEach((button, i) => {
      const buttonCode = mapping(i);
      if (!buttonCode) return;

      const buffer = bufferRef.current;
      const wasPressed = buffer[0]?.[i]?.pressed ?? false;
      const isHolding = buffer
        .slice(0, HOLD_FRAMES)
        .every((b) => b[i]?.pressed ?? false);
      const wasHeld = buffer.every((b) => b[i]?.pressed ?? false);

      if (button.pressed && !wasPressed) handler('press', buttonCode);
      if (button.pressed && isHolding && !wasHeld) handler('hold', buttonCode);
      if (!button.pressed && wasPressed && !wasHeld)
        handler('lift', buttonCode);
      if (!button.pressed && wasHeld) handler('release', buttonCode);
    });

    bufferRef.current = [[...gamepad.buttons], ...bufferRef.current].slice(
      0,
      BUFFER_SIZE,
    );
  }, [handler]);

  useFrame(poll);
}
