import { match } from 'ts-pattern';
import LineClearFeedback from './LineClearFeedback';
import { ScoreEvent } from '../gameplay';
import { useCamera } from '~/scene/shared';

type Props = {
  camera: {
    position: 'c1' | 'c2' | 'c3' | 'c4';
    relativeAxis: ReturnType<typeof useCamera>[2];
  };
  scoreEventStream: ScoreEvent[];
};

const TIMESPAN_MS = 1500;

export default function ScoreEventStream(props: Props) {
  const visibleEvents = props.scoreEventStream.filter(
    (e) => performance.now() - e.id <= TIMESPAN_MS,
  );

  return (
    <>
      {visibleEvents.map((event) =>
        match(event)
          .with({ kind: 'line-clear' }, (event) => (
            <LineClearFeedback camera={props.camera} event={event} />
          ))
          .with({ kind: 'hard-drop' }, () => null)
          .exhaustive(),
      )}
    </>
  );
}
