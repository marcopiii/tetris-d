import { Center } from '@react-three/drei';
import { ScoreRecord } from '~/scene/shared';
import { textStyleConfig } from '~/scene/shared/Word/textStyleConfig';
import Word from '../Word';

type Props = {
  title: string;
  entries: (ScoreRecord & { editing?: boolean })[];
};

export default function Scoreboard(props: Props) {
  const yOffset = textStyleConfig.menuSelected.size;

  return (
    <group position={[0, 8, 0]}>
      <Word
        text={props.title}
        textStyle="main"
        alignX="center"
        position={[0, 0, 0]}
      />
      <Center position={[0, -2.5, 0]}>
        <Word
          text="#"
          textStyle="scoreboardHeader"
          alignX="center"
          position={[-8, 0, 0]}
        />
        <Word
          text="name"
          textStyle="scoreboardHeader"
          alignX="center"
          position={[-3.5, -yOffset, 0]}
        />
        <Word
          text="score"
          textStyle="scoreboardHeader"
          alignX="center"
          position={[3.5, -yOffset, 0]}
        />
        <Word
          text="lvl"
          textStyle="scoreboardHeader"
          alignX="center"
          position={[9, 0, 0]}
        />
      </Center>
      {props.entries.map((entry, idx) => (
        <Center key={idx} position={[0, -4.5 - idx * 1.25, 0]}>
          <Word
            text={entry.rank.toString()}
            textStyle={
              entry.editing
                ? 'scoreboardScoreEntrySelected'
                : 'scoreboardScoreEntry'
            }
            position={[-8, 0, 0]}
          />
          <Word
            text={entry.name}
            textStyle={
              entry.editing ? 'scoreboardEntrySelected' : 'scoreboardEntry'
            }
            alignX="center"
            position={[-3.5, 0, 0]}
          />
          <Word
            text={entry.score.toString()}
            textStyle={
              entry.editing
                ? 'scoreboardScoreEntrySelected'
                : 'scoreboardScoreEntry'
            }
            alignX="center"
            position={[3.5, 0, 0]}
          />
          <Word
            text={entry.level.toString()}
            textStyle={
              entry.editing
                ? 'scoreboardScoreEntrySelected'
                : 'scoreboardScoreEntry'
            }
            alignX="center"
            position={[9, 0, 0]}
          />
        </Center>
      ))}
    </group>
  );
}
