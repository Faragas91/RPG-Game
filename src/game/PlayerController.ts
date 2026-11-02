import { Scene, KeyboardEventTypes } from '@babylonjs/core';

export class PlayerController {
    private keys: { [key: string]: boolean } = {};
    private _jumpRequested = false;

    constructor(private scene: Scene) {
        this.scene.onKeyboardObservable.add((event) => {
            const key = event.event.key.toLowerCase();

            if (event.type === KeyboardEventTypes.KEYDOWN) {
                this.keys[key] = true;

                if (event.event.code === "Space" && !event.event.repeat) {
                    this._jumpRequested = true;
                    event.event.preventDefault();
                }
            }

            if (event.type === KeyboardEventTypes.KEYUP) {
                this.keys[key] = false
            }

        });   
    }

    get movement() {
        return {
            forward: this.keys["w"] || false,
            backward: this.keys["s"] || false,
            left: this.keys["a"] || false,
            right: this.keys["d"] || false
        }
    }

    public consumeJump(): boolean {
        const requested = this._jumpRequested;
        this._jumpRequested = false;
        return requested;
    }
}