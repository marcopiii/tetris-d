export function copy<T>(t: T) {
  return JSON.parse(JSON.stringify(t));
}

export function play(src: string, volume?: number) {
  const audio = new Audio(src);
  audio.volume = volume ?? 1;
  audio.play();
}
