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

export default function ScoreEventStream(props: Props) {
  return props.scoreEventStream.map((event) =>
    match(event)
      .with({ kind: 'line-clear' }, (event) => (
        <LineClearFeedback key={event.id} camera={props.camera} event={event} />
      ))
      .with({ kind: 'hard-drop' }, () => null)
      .with({ kind: 't-spin' }, () => null)
      .exhaustive(),
  );
}
