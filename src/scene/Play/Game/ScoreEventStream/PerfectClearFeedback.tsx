import { match, P } from 'ts-pattern';
import { COLS, ROWS, VANISH_ZONE_ROWS } from '~/scene/Play/Game/params';
import { translate } from '~/scene/Play/Game/utils';
import { PerfectClearEvent } from '../gameplay';
import { Popup, useCamera } from '~/scene/shared';

type Props = {
  camera: {
    position: 'c1' | 'c2' | 'c3' | 'c4';
    relativeAxis: ReturnType<typeof useCamera>[2];
  };
  event: PerfectClearEvent;
};

export default function PerfectClearFeedback(props: Props) {
  const flipX = props.camera.relativeAxis.x.rightInverted;
  const flipZ = props.camera.relativeAxis.z.rightInverted;

  return props.event.planes.map((plane) => {
    const y = ROWS + VANISH_ZONE_ROWS - 1;
    const [position, rotation] = match(plane)
      .with(
        { x: P.number },
        ({ x }) =>
          [
            translate(x, y, (COLS - 1) / 2),
            flipZ ? Math.PI / 2 : -Math.PI / 2,
          ] as const,
      )
      .with(
        { z: P.number },
        ({ z }) =>
          [translate((COLS - 1) / 2, y, z), flipX ? Math.PI : 0] as const,
      )
      .exhaustive();

    return (
      <Popup
        key={JSON.stringify(plane)}
        text="CLEAR"
        alignX="center"
        position={position}
        rotation={rotation}
        toward="up"
        distance={ROWS / 2}
      />
    );
  });
}
