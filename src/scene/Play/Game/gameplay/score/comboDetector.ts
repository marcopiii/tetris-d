import { LineCoord, PlaneCoords } from '../../types';
import { PlaneCombo } from './types';

export function planeComboPerLines(lines: LineCoord[]): PlaneCombo {
  if (lines.length < 2) return 'mono';

  const orthogonalPlanes =
    lines.some((line) => 'x' in line) && lines.some((line) => 'z' in line);
  if (orthogonalPlanes) return 'orthogonal';

  const parallelPlanes =
    lines.some((line) => line.x != lines[0].x) ||
    lines.some((line) => line.z != lines[0].z);
  if (parallelPlanes) return 'parallel';

  return 'mono';
}

export function planeComboPerPlanes(planes: PlaneCoords[]): PlaneCombo {
  if (planes.length < 2) return 'mono';

  const orthogonalPlanes =
    planes.some((plane) => 'x' in plane) &&
    planes.some((plane) => 'z' in plane);
  if (orthogonalPlanes) return 'orthogonal';

  return 'parallel';
}
