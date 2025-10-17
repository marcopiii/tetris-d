export type MenuItem<T = never> = {
  name: string;
  accessory?: T;
  action: () => void;
  terminal?: boolean;
};

export type SelectableMenuItem<T = never> = MenuItem<T> & { selected: boolean };
