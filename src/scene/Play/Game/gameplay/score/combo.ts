import { ComboKind } from '~/scene/Play/Game/gameplay';
import { LineCoord } from '~/scene/Play/Game/types';

export function comboKind(lines: LineCoord[]): ComboKind {
  if (lines.length < 2) return 'std';

  const orthogonalPlanes =
    lines.some((line) => 'x' in line) && lines.some((line) => 'z' in line);
  if (orthogonalPlanes) return 'ort';

  const parallelPlanes =
    lines.some((line) => line.x != lines[0].x) ||
    lines.some((line) => line.z != lines[0].z);
  if (parallelPlanes) return 'par';

  return 'std';
}
