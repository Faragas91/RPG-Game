import { Engine } from "@babylonjs/core/Engines/engine";
import { Scene } from "@babylonjs/core/scene";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { HavokPlugin } from "@babylonjs/core/Physics/v2/Plugins/havokPlugin";

import HavokPhysics from "@babylonjs/havok";

import "@babylonjs/core/Physics";

import { GameLoop } from "./core/GameLoop";
import { Player } from "./game/Player";
import { PlayerController } from "./game/PlayerController";
import { World } from "./world/World";

export class App {
	private _canvas: HTMLCanvasElement;
	private _engine: Engine | null = null;
	private _scene: Scene | null = null;
	private _gameLoop: GameLoop | null = null;
	private _player: Player | null = null;
	private _playerController: PlayerController | null = null;
	private _world: World | null = null;

	public constructor() {
		const canvasElement = document.getElementById("canvas") as HTMLCanvasElement;
		if (!canvasElement) {
			throw new Error("Canvas element not found");
		}
		this._canvas = canvasElement;
	}

	public async init(): Promise<void> {
		this._engine = new Engine(this._canvas, true, {
			stencil: true,
			antialias: true,
			audioEngine: true,
			adaptToDeviceRatio: true,
			disableWebGL2Support: false,
			useHighPrecisionFloats: true,
			powerPreference: "high-performance",
			failIfMajorPerformanceCaveat: false,
		});

		this._scene = new Scene(this._engine);
		this._playerController = new PlayerController(this._scene);
		this._gameLoop = new GameLoop(this._engine, this._scene);
		await this._initializeScene();

		const handleResize = () => {
			this._engine?.resize();
		};

		window.addEventListener("resize", handleResize);

		this._gameLoop.start();
	}

	private async _initializeScene(): Promise<void> {
		if (!this._scene || !this._playerController || !this._gameLoop) {
			throw new Error("Scene, PlayerController or GameLoop is not initialized.");
		}

		const scene = this._scene;
		const playerController = this._playerController;
		const gameLoop = this._gameLoop;

		const havok = await HavokPhysics();
		const physicsPlugin = new HavokPlugin(true, havok);
		// Scenes are in centimeters: raise Havok's default velocity limit from 2 m/s to 200 m/s.
		physicsPlugin.setVelocityLimits(200 * 100, 100);
		scene.enablePhysics(new Vector3(0, -981, 0), physicsPlugin);

		const world = new World(scene);
		this._world = world;

		const player = new Player(scene, playerController, world.camera);
		this._player = player;
		gameLoop.add(player);

		world.camera.setTarget(player.mesh, true, false, true);
		world.shadowGenerator.addShadowCaster(player.mesh);
	}

	public dispose(): void {
		this._gameLoop?.stop();
		this._scene?.dispose();
		this._engine?.dispose();
	}
}
