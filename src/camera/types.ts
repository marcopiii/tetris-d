export type Position =
  | 'xR_zR'
  | 'xL_zR'
  | 'xL_zL'
  | 'xR_zL'
  | 'x0_zR'
  | 'x0_zL'
  | 'xR_z0'
  | 'xL_z0';

export type RelativeDirection = {
  x: 'positive' | 'negative';
  z: 'positive' | 'negative';
};
