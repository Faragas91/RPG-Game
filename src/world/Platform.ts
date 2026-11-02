import { ShadowGenerator } from "@babylonjs/core/Lights/Shadows/shadowGenerator";
import { Color3 } from "@babylonjs/core/Maths/math.color";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";
import { MeshBuilder } from "@babylonjs/core/Meshes/meshBuilder";
import { PhysicsAggregate } from "@babylonjs/core/Physics/v2/physicsAggregate";
import { PhysicsShapeType } from "@babylonjs/core/Physics/v2/IPhysicsEnginePlugin";
import type { Scene } from "@babylonjs/core/scene";
import { Mesh } from "@babylonjs/core/Meshes/mesh.pure";
import { DirectionalLight } from "@babylonjs/core";

export interface PlatformConfig {
    name?: string;
    position: Vector3;
    size: { width: number; height: number; depth: number };
    color?: Color3;
}

export class Platform {
    readonly mesh: Mesh;
    readonly aggregate: PhysicsAggregate;

    constructor(scene: Scene, config: PlatformConfig, shadowGenerator: ShadowGenerator) {
        const mesh  = MeshBuilder.CreateBox(
			config.name ?? "platform",
            { width: config.size.width, height: config.size.height, depth: config.size.depth },
            scene
		);
        mesh.position.copyFrom(config.position);

		const meshMaterial = new StandardMaterial("platformMaterial", scene);
		meshMaterial.diffuseColor = config.color ?? new Color3(0.75, 0.5, 0.3);
		meshMaterial.specularColor = new Color3(0.1, 0.05, 0.05);
		mesh.material = meshMaterial;

        mesh.receiveShadows = true;
        shadowGenerator.addShadowCaster(mesh);

        this.mesh = mesh;
		this.aggregate = new PhysicsAggregate(
			mesh,
			PhysicsShapeType.BOX,
			{ mass: 0, friction: 0.2, restitution: 0.2 },
			scene,
		);
    }

    dispose(): void {
        this.aggregate.dispose();
        this.mesh.dispose();
    }
}
        
        
        
        
