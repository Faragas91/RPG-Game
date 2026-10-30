import type { IUpdatable } from "../core/IUpdatable";
import type { PlayerController } from "./PlayerController";
import { Color3 } from "@babylonjs/core/Maths/math.color";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";
import { MeshBuilder } from "@babylonjs/core/Meshes/meshBuilder";
import type { Mesh } from "@babylonjs/core/Meshes/mesh";
import { PhysicsAggregate } from "@babylonjs/core/Physics/v2/physicsAggregate";
import { PhysicsShapeType } from "@babylonjs/core/Physics/v2/IPhysicsEnginePlugin";
import { Ray } from "@babylonjs/core/Culling/ray";
import type { Scene } from "@babylonjs/core/scene";
import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera";
import { Axis } from "@babylonjs/core";

export class Player implements IUpdatable {
	private static readonly Size = 100;
	private static readonly MoveSpeed = 300;
	private static readonly JumpSpeed = 600;
	private static readonly GroundCheckDistance = 5;

	public readonly mesh: Mesh;
	public readonly aggregate: PhysicsAggregate;

	public constructor(
		scene: Scene,
		private readonly _playerController: PlayerController,
		private readonly _camera: ArcRotateCamera
	) {
		const mesh = MeshBuilder.CreateBox("Player", { size: Player.Size }, scene);
		mesh.position = new Vector3(0, 200, 0);

		const material = new StandardMaterial("playerMaterial", scene);
		material.diffuseColor = new Color3(0.85, 0.35, 0.2);
		material.specularColor = new Color3(0.2, 0.2, 0.2);
		mesh.material = material;

		this.mesh = mesh;
		this.aggregate = new PhysicsAggregate(
			mesh,
			PhysicsShapeType.BOX,
			{ mass: 1, friction: 0.2, restitution: 0.2 },
			scene,
		);
	}

	public update(_deltaTime: number): void {
		const movement = this._playerController.movement;
		
		const x = (movement.right ? 1 : 0) - (movement.left ? 1 : 0);
		const z = (movement.forward ? 1 : 0) - (movement.backward ? 1 : 0);
		const cameraRight = this._camera.getDirection(Axis.X);
		const cameraForward = this._camera.getDirection(Axis.Z);

		const cameraForwardDirection = new Vector3(cameraForward.x, 0, cameraForward.z);
		cameraForwardDirection.normalize();
		const cameraRightDirection = new Vector3(cameraRight.x, 0, cameraRight.z);
		cameraRightDirection.normalize();

		const cameraMovement = new Vector3(cameraForwardDirection.x * z + cameraRightDirection.x * x, 0, cameraForwardDirection.z * z + cameraRightDirection.z * x);
		if (cameraMovement.lengthSquared() > 0) {
			cameraMovement.normalize();
		}
		
		const velocity = this.aggregate.body.getLinearVelocity();

		if (this._playerController.consumeJump() && this._isGrounded()) {
			velocity.y = Player.JumpSpeed;
		}

		velocity.x = cameraMovement.x * Player.MoveSpeed;
		velocity.z = cameraMovement.z * Player.MoveSpeed;
		this.aggregate.body.setLinearVelocity(velocity);
	}

	private _isGrounded(): boolean {
		const boundingBox = this.mesh.getBoundingInfo().boundingBox;
		const origin = boundingBox.centerWorld;
		const direction = Vector3.Down();
		const length = boundingBox.extendSizeWorld.y + Player.GroundCheckDistance;
		const ray = new Ray(origin, direction, length);
		const pick = this.mesh.getScene().pickWithRay(ray, (mesh) => mesh !== this.mesh);

		return pick?.hit === true;
	}
}
