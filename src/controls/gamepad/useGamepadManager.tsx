import { useFrame } from '@react-three/fiber';
import { isEqual, noop, round } from 'es-toolkit';
import React from 'react';
import { match, P } from 'ts-pattern';
import { mapping } from './mapping';
import { GamepadButtonEvent, GamepadStick, GamepadStickStatus } from './types';
import type { GamepadButton } from './types';

type DOMGamepadButton = globalThis.GamepadButton;

const HOLD_FRAMES = 12;
const BUFFER_SIZE = HOLD_FRAMES + 1;
const DEADZONE = 0.1;

export default function useGamepadManager(
  buttonHandler: (
    event: GamepadButtonEvent,
    button: Omit<GamepadButton, 'LT' | 'RT'>,
  ) => void,
  triggerHandler: (
    value: number,
    side: Extract<GamepadButton, 'LT' | 'RT'>,
  ) => void,
  stickHandler: (status: GamepadStickStatus, stick: GamepadStick) => void,
) {
  const buttonBufferRef = React.useRef<DOMGamepadButton[][]>([]);
  const stickBufferRef = React.useRef<[GamepadStickStatus, GamepadStickStatus]>(
    [
      { x: 0, y: 0 },
      { x: 0, y: 0 },
    ],
  );

  const manageTrigger =
    (domButton: DOMGamepadButton, i: number) =>
    (triggerCode: Extract<GamepadButton, 'LT' | 'RT'>) => {
      const buffer = buttonBufferRef.current;
      const prevValue = roundValue(buffer[0]?.[i]?.value ?? 0);
      const currValue = roundValue(domButton.value);

      if (currValue !== prevValue) {
        triggerHandler(currValue, triggerCode);
      }
    };

  const manageButton =
    (domButton: DOMGamepadButton, i: number) =>
    (buttonCode: Omit<GamepadButton, 'LT' | 'RT'>) => {
      const buffer = buttonBufferRef.current;
      const wasPressed = buffer[0]?.[i]?.pressed ?? false;
      const isHolding = buffer
        .slice(0, HOLD_FRAMES)
        .every((b) => b[i]?.pressed ?? false);
      const wasHeld = buffer.every((b) => b[i]?.pressed ?? false);

      if (domButton.pressed && !wasPressed) buttonHandler('press', buttonCode);
      if (domButton.pressed && isHolding && !wasHeld)
        buttonHandler('hold', buttonCode);
      if (!domButton.pressed && wasPressed && !wasHeld)
        buttonHandler('lift', buttonCode);
      if (!domButton.pressed && wasHeld) buttonHandler('release', buttonCode);
    };

  const poll = () => {
    const gamepad = navigator.getGamepads()[0];
    if (!gamepad) return;

    gamepad.buttons.forEach((button, i) => {
      match(mapping(i))
        .with(P.nullish, noop)
        .with(P.union('LT', 'RT'), manageTrigger(button, i))
        .otherwise(manageButton(button, i));
    });
    
    buttonBufferRef.current = [
      [...gamepad.buttons],
      ...buttonBufferRef.current,
    ].slice(0, BUFFER_SIZE);

    const [lx, ly, rx, ry] = gamepad.axes.map(roundValue).map(applyDeadzone);
    const leftStick = { x: lx, y: ly };
    const rightStick = { x: rx, y: ry };

    const [prevLeft, prevRight] = stickBufferRef.current;
    stickBufferRef.current = [leftStick, rightStick];
    if (!isEqual(leftStick, prevLeft)) {
      stickHandler(leftStick, 'left');
    }
    if (!isEqual(rightStick, prevRight)) {
      stickHandler(rightStick, 'right');
    }
  };

  useFrame(poll);
}

const roundValue = (v: number) => round(v, 2);
const applyDeadzone = (v: number) => (Math.abs(v) < DEADZONE ? 0 : v);
