import { match, P } from 'ts-pattern';
import { useGameParams } from '~/scene/Play/Game/params';
import { translate } from '~/scene/Play/Game/utils';
import { PerfectClearEvent } from '../gameplay';
import { Popup, useCamera } from '~/scene/shared';

type Props = {
  camera: {
    position: 'c1' | 'c2' | 'c3' | 'c4';
    relativeAxes: ReturnType<typeof useCamera>['relativeAxes'];
  };
  event: PerfectClearEvent;
};

export default function PerfectClearFeedback(props: Props) {
  const gameParams = useGameParams();
  const { cols, rows, vanishZoneRows } = gameParams;
  const flipX = props.camera.relativeAxes.x.rightInverted;
  const flipZ = props.camera.relativeAxes.z.rightInverted;

  return props.event.planes.map((plane) => {
    const y = rows + vanishZoneRows - 1;
    const [position, rotation] = match(plane)
      .with(
        { x: P.number },
        ({ x }) =>
          [
            translate(x, y, (cols - 1) / 2, gameParams),
            flipZ ? Math.PI / 2 : -Math.PI / 2,
          ] as const,
      )
      .with(
        { z: P.number },
        ({ z }) =>
          [
            translate((cols - 1) / 2, y, z, gameParams),
            flipX ? Math.PI : 0,
          ] as const,
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
        distance={rows / 2}
      />
    );
  });
}
