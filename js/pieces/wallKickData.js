/**
 * @see https://tetris.wiki/Super_Rotation_System#Wall_Kicks
 */
export function wallKickData(piece: "I" | "J" | "L" | "O" | "S" | "T" | "Z") {
    switch (piece) {
        case "I":
            return [
                { initial: "0", final: "R", tests: [[0, 0],	[-2, 0], [+1, 0], [-2, -1], [+1, +2]] },
                { initial: "R", final: "2", tests: [[0, 0],	[-1, 0], [+2, 0], [-1, +2], [+2, -1]] },
                { initial: "2", final: "L", tests: [[0, 0],	[+2, 0], [-1, 0], [+2, +1], [-1, -2]] },
                { initial: "L", final: "0", tests: [[0, 0],	[+1, 0], [-2, 0], [+1, -2], [-2, +1]] },
                { initial: "0", final: "L", tests: [[0, 0],	[-1, 0], [+2, 0], [-1, +2], [+2, -1]] },
                { initial: "L", final: "2", tests: [[0, 0],	[-2, 0], [+1, 0], [-2, -1], [+1, +2]] },
                { initial: "2", final: "R", tests: [[0, 0],	[+1, 0], [-2, 0], [+1, -2], [-2, +1]] },
                { initial: "R", final: "0", tests: [[0, 0],	[+2, 0], [-1, 0], [+2, +1], [-1, -2]] },
            ];
        case "J":
        case "L":
        case "S":
        case "T":
        case "Z":
            return [
                { initial: "0", final: "R", tests: [[0, 0],	[-1, 0], [-1, +1], [0, -2], [-1, -2]] },
                { initial: "R", final: "2", tests: [[0, 0],	[+1, 0], [+1, -1], [0, +2], [+1, +2]] },
                { initial: "2", final: "L", tests: [[0, 0],	[+1, 0], [+1, +1], [0, -2], [+1, -2]] },
                { initial: "L", final: "0", tests: [[0, 0],	[-1, 0], [-1, -1], [0, +2], [-1, +2]] },
                { initial: "0", final: "L", tests: [[0, 0],	[+1, 0], [+1, +1], [0, -2], [+1, -2]] },
                { initial: "L", final: "2", tests: [[0, 0],	[-1, 0], [-1, -1], [0, +2], [-1, +2]] },
                { initial: "2", final: "R", tests: [[0, 0],	[+1, 0], [+1, -1], [0, +2], [+1, +2]] },
                { initial: "R", final: "0", tests: [[0, 0],	[-1, 0], [-1, +1], [0, -2], [-1, -2]] }
            ];
        case "O":
            return [
                { initial: "0", final: "R", tests: [[0, 0],	[0, 0], [0, 0], [0, 0], [0, 0]] },
                { initial: "R", final: "2", tests: [[0, 0],	[0, 0], [0, 0], [0, 0], [0, 0]] },
                { initial: "2", final: "L", tests: [[0, 0],	[0, 0], [0, 0], [0, 0], [0, 0]] },
                { initial: "L", final: "0", tests: [[0, 0],	[0, 0], [0, 0], [0, 0], [0, 0]] },
                { initial: "0", final: "L", tests: [[0, 0],	[0, 0], [0, 0], [0, 0], [0, 0]] },
                { initial: "L", final: "2", tests: [[0, 0],	[0, 0], [0, 0], [0, 0], [0, 0]] },
                { initial: "2", final: "R", tests: [[0, 0],	[0, 0], [0, 0], [0, 0], [0, 0]] },
                { initial: "R", final: "0", tests: [[0, 0],	[0, 0], [0, 0], [0, 0], [0, 0]] },
            ];
    }
}