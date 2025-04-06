export type Position =
  | 'xR_zR'
  | 'xL_zR'
  | 'xL_zL'
  | 'xR_zL'

export type RelativeDirection = {
  x: 'positive' | 'negative';
  z: 'positive' | 'negative';
};
