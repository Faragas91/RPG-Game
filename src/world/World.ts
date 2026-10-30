import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera";
import { DirectionalLight } from "@babylonjs/core/Lights/directionalLight";
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight";
import { ShadowGenerator } from "@babylonjs/core/Lights/Shadows/shadowGenerator";
import { Color3, Color4 } from "@babylonjs/core/Maths/math.color";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";
import { MeshBuilder } from "@babylonjs/core/Meshes/meshBuilder";
import { PhysicsAggregate } from "@babylonjs/core/Physics/v2/physicsAggregate";
import { PhysicsShapeType } from "@babylonjs/core/Physics/v2/IPhysicsEnginePlugin";
import type { Scene } from "@babylonjs/core/scene";

import "@babylonjs/core/Lights/Shadows/shadowGeneratorSceneComponent";

export class World {
	public readonly camera: ArcRotateCamera;
	public readonly shadowGenerator: ShadowGenerator;
	public readonly groundAggregate: PhysicsAggregate;

	public constructor(scene: Scene) {
		scene.clearColor = new Color4(0.04, 0.06, 0.1, 1);

		this.camera = new ArcRotateCamera(
			"camera",
			-Math.PI / 4,
			1.2,
			700,
			new Vector3(0, 100, 0),
			scene,
		);
		this.camera.attachControl();
		this.camera.lowerBetaLimit = 0.2;
		this.camera.upperBetaLimit = 1.45;
		this.camera.lowerRadiusLimit = 400;
		this.camera.upperRadiusLimit = 1000;
		this.camera.panningSensibility = 0;
		this.camera.wheelDeltaPercentage = 0.01;
		this.camera.inertia = 0.8;
		scene.activeCamera = this.camera;

		const ambientLight = new HemisphericLight("ambientLight", new Vector3(0, 1, 0), scene);
		ambientLight.intensity = 0.6;
		ambientLight.groundColor = new Color3(0.15, 0.18, 0.25);

		const sun = new DirectionalLight("sun", new Vector3(-0.5, -1, 0.5), scene);
		sun.position = new Vector3(500, 1000, -500);
		sun.intensity = 1.1;

		this.shadowGenerator = new ShadowGenerator(1024, sun);
		this.shadowGenerator.useBlurExponentialShadowMap = true;
		this.shadowGenerator.blurKernel = 32;

		const ground = MeshBuilder.CreateGround(
			"ground",
			{ width: 2000, height: 2000 },
			scene,
		);
		ground.receiveShadows = true;

		const groundMaterial = new StandardMaterial("groundMaterial", scene);
		groundMaterial.diffuseColor = new Color3(0.25, 0.5, 0.3);
		groundMaterial.specularColor = new Color3(0.05, 0.05, 0.05);
		ground.material = groundMaterial;

		this.groundAggregate = new PhysicsAggregate(
			ground,
			PhysicsShapeType.BOX,
			{ mass: 0, friction: 0.5 },
			scene,
		);
	}
}
