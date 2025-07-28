export const clamp = (min: number, max: number) => (num: number) =>
  num > max ? max : num < min ? min : num;

export function copy<T>(t: T): T {
  return JSON.parse(JSON.stringify(t));
}

export function play(src: string, volume?: number) {
  const audio = new Audio(src);
  audio.volume = volume ?? 1;
  audio.play();
}
