export function copy<T>(t: T) {
  return JSON.parse(JSON.stringify(t));
}

export function play(src: string) {
  const audio = new Audio(src);
  audio.play();
}
