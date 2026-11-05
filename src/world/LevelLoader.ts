import type { AbstractMesh, Scene } from "@babylonjs/core";
import { PhysicsAggregate } from "@babylonjs/core/Physics/v2/physicsAggregate";
import { PhysicsShapeType } from "@babylonjs/core/Physics/v2/IPhysicsEnginePlugin";

export class LevelLoader {
	private readonly _scene: Scene;
	private readonly _aggregates: PhysicsAggregate[] = [];

	public constructor(scene: Scene) {
		this._scene = scene;
	}

	public addStaticColliders(): void {
		for (const mesh of this._scene.meshes) {
			if (!this._isStaticCollider(mesh)) {
				continue;
			}
			this._aggregates.push(
				new PhysicsAggregate(
					mesh,
					PhysicsShapeType.BOX,
					{ mass: 0, friction: 0.5 },
					this._scene,
				),
			);
		}
	}

	private _isStaticCollider(mesh: AbstractMesh): boolean {
		return mesh.name === "ground" || mesh.name.startsWith("platform_");
	}
}
