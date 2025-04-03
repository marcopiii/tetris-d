export function adjustBrightness(hex: string, factor: number) {
  const rgb = parseInt(hex.slice(1), 16);
  const r = Math.min(255, Math.max(0, ((rgb >> 16) & 0xff) + factor));
  const g = Math.min(255, Math.max(0, ((rgb >> 8) & 0xff) + factor));
  const b = Math.min(255, Math.max(0, (rgb & 0xff) + factor));
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}
