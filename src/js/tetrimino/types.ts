export type Name = "I" | "O" | "T" | "J" | "L" | "S" | "Z";

export type Shape = number[][];

export type RotationState = "0" | "R" | "2" | "L";

export type WallKick = [number, number]

export type WallKickData = { initial: RotationState, final: RotationState, tests: WallKick[] }[]