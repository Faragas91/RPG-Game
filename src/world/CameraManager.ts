import { AbstractMesh, ArcRotateCamera, Camera, Scene, Vector3 } from "@babylonjs/core";


export class CameraManager {
	public readonly followCamera: ArcRotateCamera;
  	public readonly isoCamera: ArcRotateCamera;
	private _activeCamera: ArcRotateCamera;

    constructor(private readonly _scene: Scene ) {
		this.followCamera = this._createFollowCamera();
    	this.isoCamera = this._createIsoCamera();

		this._activeCamera = this.followCamera;
    	this._scene.activeCamera = this._activeCamera;

	}

	private _createFollowCamera(): ArcRotateCamera {
		const follow = new ArcRotateCamera(
			"followCamera",
			-Math.PI / 4,
			1.2,
			700,
			new Vector3(0, 50, 0),
			this._scene,
		);
		follow.attachControl();
		follow.lowerBetaLimit = 0.2;
		follow.upperBetaLimit = 1.45;
		follow.lowerRadiusLimit = 400;
		follow.upperRadiusLimit = 1000;
		follow.panningSensibility = 0;
		follow.wheelDeltaPercentage = 0.01;
		follow.inertia = 0.8;
		return follow;
	}

	private _createIsoCamera(): ArcRotateCamera {
		const iso = new ArcRotateCamera(
			"isoCamera",
			-Math.PI / 4,
			1.2,
			700,
			new Vector3(0, 100, 0),
			this._scene,
		);
		iso.mode = Camera.ORTHOGRAPHIC_CAMERA;
		iso.alpha = -Math.PI / 4;          // 45° Yaw, wie Follow-Kamera
		iso.beta = Math.atan(Math.SQRT2);  // ≈ 0.9553 rad → echte Iso-Elevation 35,26°
		iso.radius = 2000;
		iso.lowerRadiusLimit = iso.upperRadiusLimit = 2000;
		iso.minZ = 0.1;
		iso.maxZ = 10000;
		return iso;
	}

	get activeCamera(): ArcRotateCamera {
		return this._activeCamera;
	}

	follow(target: AbstractMesh): void {
		this.followCamera?.setTarget(target, true, false, true);
		this.isoCamera?.setTarget(target, true, false, true);
	}

	toggle(): void {
		if (this.activeCamera.name === "followCamera") {
			this._activeCamera = this.isoCamera;
    		this._scene.activeCamera = this._activeCamera;
		} else if (this._activeCamera.name === "isoCamera") {
			this._activeCamera = this.followCamera;
    		this._scene.activeCamera = this._activeCamera;
		}
	}
}