export class GamepadManager {

    constructor(
        onPress: (button?: "LT" | "RT") => void,
        onRelease: (button?: "LT" | "RT") => void
    ) {
        this._onPress = onPress;
        this._onRelease = onRelease;
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
            if (button.pressed && !this._buffer[i]?.pressed)
                this._onPress(buttonMapping(i));
            if (!button.pressed && this._buffer[i]?.pressed)
                this._onRelease(buttonMapping(i));
        })
        this._buffer = gamepad.buttons;
    }

}

function buttonMapping(i: number) {
    switch (i) {
        case 6: return "LT";
        case 7: return "RT";
        default: return undefined;
    }
}