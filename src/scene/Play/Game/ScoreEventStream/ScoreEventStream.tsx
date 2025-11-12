import { match } from 'ts-pattern';
import PerfectClearFeedback from './PerfectClearFeedback';
import TSpinFeedback from './TSpinFeedback';
import LineClearFeedback from './LineClearFeedback';
import { ScoreEvent } from '../gameplay';
import { useCamera } from '~/scene/shared';

type Props = {
  camera: {
    position: 'c1' | 'c2' | 'c3' | 'c4';
    relativeAxes: ReturnType<typeof useCamera>['relativeAxes'];
  };
  scoreEventStream: ScoreEvent[];
};

export default function ScoreEventStream(props: Props) {
  return props.scoreEventStream.map((event) =>
    match(event)
      .with({ kind: 'line-clear' }, (event) => (
        <LineClearFeedback key={event.id} camera={props.camera} event={event} />
      ))
      .with({ kind: 'perfect-clear' }, (event) => (
        <PerfectClearFeedback
          key={event.id}
          camera={props.camera}
          event={event}
        />
      ))
      .with({ kind: 'hard-drop' }, () => null)
      .with({ kind: 'soft-drop' }, () => null)
      .with({ kind: 'combo' }, () => null)
      .with({ kind: 't-spin' }, (event) => (
        <TSpinFeedback key={event.id} camera={props.camera} event={event} />
      ))
      .with({ kind: 'zic' }, (event) => null)
      .exhaustive(),
  );
}
