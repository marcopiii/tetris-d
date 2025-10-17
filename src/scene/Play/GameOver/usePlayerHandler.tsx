import React from 'react';

type PlayerHandlerState = {
  characters: [string, string, string];
  focusedIndex: number;
};

export default function usePlayerHandler() {
  const [state, setState] = React.useState<PlayerHandlerState>({
    characters: ['A', 'A', 'A'],
    focusedIndex: 0,
  });

  const up = () => {
    setState((prevState) => {
      const currentChar = prevState.characters[prevState.focusedIndex];
      const nextChar =
        currentChar === 'Z'
          ? 'A'
          : String.fromCharCode(currentChar.charCodeAt(0) + 1);

      const newCharacters = prevState.characters.map((char, index) =>
        index === prevState.focusedIndex ? nextChar : char,
      ) as [string, string, string];

      return {
        ...prevState,
        characters: newCharacters,
      };
    });
  };

  const down = () => {
    setState((prevState) => {
      const currentChar = prevState.characters[prevState.focusedIndex];
      const prevChar =
        currentChar === 'A'
          ? 'Z'
          : String.fromCharCode(currentChar.charCodeAt(0) - 1);

      const newCharacters = prevState.characters.map((char, index) =>
        index === prevState.focusedIndex ? prevChar : char,
      ) as [string, string, string];

      return {
        ...prevState,
        characters: newCharacters,
      };
    });
  };

  const left = () => {
    setState((prevState) => ({
      ...prevState,
      focusedIndex: prevState.focusedIndex > 0 ? prevState.focusedIndex - 1 : 2, // Wrap to last character
    }));
  };

  const right = () => {
    setState((prevState) => ({
      ...prevState,
      focusedIndex: prevState.focusedIndex < 2 ? prevState.focusedIndex + 1 : 0, // Wrap to first character
    }));
  };

  return {
    handle: state.characters,
    i: state.focusedIndex,
    action: { up, down, left, right },
  };
}
