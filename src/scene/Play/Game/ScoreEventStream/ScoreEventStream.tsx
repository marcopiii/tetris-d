import { match } from 'ts-pattern';
import TSpinFeedback from '~/scene/Play/Game/ScoreEventStream/TSpinFeedback';
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
      .with({ kind: 'perfect-clear' }, () => null)
      .with({ kind: 'hard-drop' }, () => null)
      .with({ kind: 't-spin' }, (event) => (
        <TSpinFeedback key={event.id} camera={props.camera} event={event} />
      ))
      .exhaustive(),
  );
}
