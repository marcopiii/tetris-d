import { useFrame } from '@react-three/fiber';
import React from 'react';
import { mapping } from './mapping';
import type { Event, GamepadAxis } from './types';
import type { GamepadButton } from './types';

type DOMGamepadButton = globalThis.GamepadButton;

const HOLD_FRAMES = 12;
const BUFFER_SIZE = HOLD_FRAMES + 1;
const DEADZONE = 0.1;

export default function useGamepadManager(
  handler: (event: Event, button: GamepadButton) => void,
  axisHandler: (axis: GamepadAxis) => void,
) {
  const buttonBufferRef = React.useRef<DOMGamepadButton[][]>([]);
  const axesBufferRef = React.useRef<
    [{ x: number; y: number } | undefined, { x: number; y: number } | undefined]
  >([undefined, undefined]);

  const poll = () => {
    const gamepad = navigator.getGamepads()[0];
    if (!gamepad) return;

    gamepad.buttons.forEach((button, i) => {
      const buttonCode = mapping(i);
      if (!buttonCode) return;

      const buffer = buttonBufferRef.current;
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

    buttonBufferRef.current = [
      [...gamepad.buttons],
      ...buttonBufferRef.current,
    ].slice(0, BUFFER_SIZE);

    const lx = Math.abs(gamepad.axes[0]) < DEADZONE ? 0 : gamepad.axes[0];
    const ly = Math.abs(gamepad.axes[1]) < DEADZONE ? 0 : gamepad.axes[1];
    const rx = Math.abs(gamepad.axes[2]) < DEADZONE ? 0 : gamepad.axes[2];
    const ry = Math.abs(gamepad.axes[3]) < DEADZONE ? 0 : gamepad.axes[3];

    const [left, right] = axesBufferRef.current;

    if (left === undefined || left.x !== lx || left.y !== ly) {
      const new_value: GamepadAxis = { which: 'left', x: lx, y: ly };
      axesBufferRef.current = [{ x: lx, y: ly }, right];
      axisHandler(new_value);
    }
    if (right === undefined || right.x !== lx || right.y !== ly) {
      const new_value: GamepadAxis = { which: 'right', x: rx, y: ry };
      axesBufferRef.current = [left, { x: rx, y: ry }];
      axisHandler(new_value);
    }
  };

  useFrame(poll);
}
