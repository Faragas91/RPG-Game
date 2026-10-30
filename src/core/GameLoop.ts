import type { Engine, Scene } from '@babylonjs/core';
import type { IUpdatable } from './IUpdatable';

export class GameLoop {
    private static readonly MaxDeltaTime = 0.1;

    private readonly _engine: Engine;
    private readonly _scene: Scene;
    private readonly _updatables: IUpdatable[] = [];
    private readonly _render = (): void => this._tick();
    private _running: boolean = false;

    public constructor(engine: Engine, scene: Scene) {
        this._engine = engine;
        this._scene = scene;
    }

    public add(updatables: IUpdatable): void {
        this._updatables.push(updatables);
    }

    public start(): void {
        if (this._running) {
            return;
        }
        this._running = true;
        this._engine.runRenderLoop(this._render);
    }

    public stop(): void {
        if (!this._running) {
            return;
        }
        this._running = false;
        this._engine.stopRenderLoop(this._render);
    }

    private _tick(): void {
        const deltaTime = Math.min(this._engine.getDeltaTime() / 1000, GameLoop.MaxDeltaTime);

        for (const updatables of this._updatables) {
            updatables.update(deltaTime);
        }

        this._scene.render();
    }
}