import { Engine } from "@babylonjs/core/Engines/engine";
import { Scene } from "@babylonjs/core/scene";
import { SceneLoaderFlags } from "@babylonjs/core/Loading/sceneLoaderFlags";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { HavokPlugin } from "@babylonjs/core/Physics/v2/Plugins/havokPlugin";

import HavokPhysics from "@babylonjs/havok";

import "@babylonjs/core/Physics";

// Side-effect imports: register the loaders/components the editor scene needs.
import "@babylonjs/core/Loading/loadingScreen";
import "@babylonjs/core/Loading/Plugins/babylonFileLoader";
import "@babylonjs/core/Cameras/camera";
import "@babylonjs/core/Cameras/universalCamera";
import "@babylonjs/core/Meshes/groundMesh";
import "@babylonjs/core/Lights/Shadows/shadowGeneratorSceneComponent";
import "@babylonjs/core/Lights/Shadows/cascadedShadowGenerator";
import "@babylonjs/core/Materials/PBR/pbrMaterial";
import "@babylonjs/core/Materials/standardMaterial";
import "@babylonjs/core/Materials/Textures/cubeTexture";
import "@babylonjs/core/Materials/Textures/Loaders/envTextureLoader";
import "@babylonjs/materials/sky";
// The sky material loads its shaders lazily via dynamic imports, which can
// race ahead of the first compile. Registering them statically is deterministic.
import "@babylonjs/materials/sky/sky.vertex.js";
import "@babylonjs/materials/sky/sky.fragment.js";

import { loadScene } from "babylonjs-editor-tools";

import { GameLoop } from "./core/GameLoop";
import { Player } from "./game/Player";
import { PlayerController } from "./game/PlayerController";
import { CameraManager } from "./world/CameraManager";
import { LevelLoader } from "./world/LevelLoader";
import { scriptsMap } from "./scripts";
import { Mesh } from "@babylonjs/core";

export class App {
	private _canvas: HTMLCanvasElement;
	private _engine: Engine | null = null;
	private _scene: Scene | null = null;
	private _gameLoop: GameLoop | null = null;
	private _player: Player | null = null;
	private _playerController: PlayerController | null = null;
	private _cameraManager: CameraManager | null = null;

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
		this._playerController = new PlayerController(this._scene, () => {
			this._cameraManager?.toggle();
		});
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

		// Load the editor scene instead of building the world in code.
		SceneLoaderFlags.ForceFullSceneLoadingForIncremental = true;
		await loadScene("/scene/", "level01.babylon", scene, scriptsMap, {
			quality: "high",
		});

		// Static colliders for the level geometry: ground + all platform_* meshes.
		const levelLoader = new LevelLoader(scene);
		levelLoader.addStaticColliders();

		// Gameplay camera(s) install after the editor scene so they win activeCamera.
		this._cameraManager = new CameraManager(scene);

		const playerMesh = scene.getMeshByName("player");
		if (!(playerMesh instanceof Mesh)) {
			throw new Error('Editor scene is missing a mesh named "player".');
		}
		const player = new Player(playerMesh, playerController);
		this._player = player
		this._gameLoop.add(player);
		this._cameraManager.follow(player.mesh);
	}

	public dispose(): void {
		this._gameLoop?.stop();
		this._scene?.dispose();
		this._engine?.dispose();
	}
}
