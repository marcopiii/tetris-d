import React from 'react';
import { GamepadStickStatus } from '~/controls/gamepad/types';

const HARD_THRESHOLD = 0.9;

export function useControlsMiddleware(effect: {
  onHardLeft: () => void;
  onHardRight: () => void;
  onTilt: (direction: GamepadStickStatus) => void;
}) {
  const rightStickBufferRef = React.useRef<GamepadStickStatus>({ x: 0, y: 0 });

  const handleRightStickInput = (status: GamepadStickStatus) => {
    const currX = status.x;
    const prevX = rightStickBufferRef.current.x;
    rightStickBufferRef.current = status;

    effect.onTilt(status);

    if (!isHardLeft(prevX) && isHardLeft(currX)) {
      effect.onHardLeft();
    }
    if (!isHardRight(prevX) && isHardRight(currX)) {
      effect.onHardRight();
    }
  };

  return handleRightStickInput;
}

function isHardLeft(value: number) {
  return value <= -HARD_THRESHOLD;
}

function isHardRight(value: number) {
  return value >= HARD_THRESHOLD;
}
