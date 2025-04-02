export class GamepadManager {

    constructor(handler: (event: "press" | "release", button: "start" | "padL" | "padD" | "padR" | "padU" | "A" | "B" | "X" | "LB" | "RB" | "LT" | "RT") => void) {
        this._handler = handler;
        this._gamepadIndex = undefined;
        this._buffer = [];
    }

    connect(gamepad: Gamepad) {
        console.log("connecting gamepad", gamepad);
        this._gamepadIndex = gamepad.index;
    }

    disconnect() {
        this._gamepadIndex = undefined;
    }

    poll() {
        if (this._gamepadIndex === undefined)
            return;

        const gamepad = navigator.getGamepads()[this._gamepadIndex];

        gamepad.buttons.forEach((button, i) => {
            const buttonCode = buttonMapping(i)
            if (!buttonCode)
                return;
            if (button.pressed && !this._buffer[i]?.pressed)
                this._handler("press", buttonCode);
            if (!button.pressed && this._buffer[i]?.pressed)
                this._handler("release", buttonCode);
        })
        this._buffer = gamepad.buttons;
    }

}

function buttonMapping(i: number) {
    switch (i) {
        case 0: return "A";
        case 1: return "B";
        case 2: return "X";
        case 3: return "Y";
        case 4: return "LB";
        case 5: return "RB";
        case 6: return "LT";
        case 7: return "RT";
        case 9: return "start";
        case 12: return "padU";
        case 13: return "padD";
        case 14: return "padL";
        case 15: return "padR";
        default: return undefined;
    }
}