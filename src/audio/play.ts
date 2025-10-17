export default function play(src: string, volume?: number) {
  const audio = new Audio(src);
  audio.volume = volume ?? 1;
  audio.play();
}
