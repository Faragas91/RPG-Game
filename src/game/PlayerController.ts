import { Scene, KeyboardEventTypes } from '@babylonjs/core';
import { CameraManager } from '../world/CameraManager';

export class PlayerController {
    private keys: { [key: string]: boolean } = {};
    private _jumpRequested = false;
    public cameraManager: CameraManager | null = null;

    constructor(private scene: Scene) {
        this.cameraManager = new CameraManager(scene);
        this.scene.onKeyboardObservable.add((event) => {
            const key = event.event.key.toLowerCase();

            if (event.type === KeyboardEventTypes.KEYDOWN) {
                this.keys[key] = true;

                if (event.event.code === "Space" && !event.event.repeat) {
                    this._jumpRequested = true;
                    event.event.preventDefault();
                }

                if (event.event.code === "KeyC" && !event.event.repeat) {
                    this.cameraManager?.toggle();
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