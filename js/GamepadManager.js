export class GamepadManager {

    constructor(
        onPress: (button: GamepadButton) => void,
        onRelease: (button: GamepadButton) => void
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
        if (this._gamepadIndex === undefined) {
            return;
        }
        const gamepad = navigator.getGamepads()[this._gamepadIndex];

        for (let i = 0; i < gamepad.buttons.length; i++) {
            if (gamepad.buttons[i].pressed && !this._buffer[i]?.pressed) {
                this._onPress(gamepad.buttons[i]);
                break;
            }
            if (!gamepad.buttons[i].pressed && this._buffer[i]?.pressed) {
                this._onRelease(gamepad.buttons[i]);
                break;
            }
        }
        this._buffer = gamepad.buttons;
    }

}