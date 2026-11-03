import { AbstractMesh, ArcRotateCamera, Camera, Scene, Vector3 } from "@babylonjs/core";


export class CameraManager {
	public readonly camera: ArcRotateCamera | null = null;
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
		this._activeCamera = new ArcRotateCamera(
			"followCamera",
			-Math.PI / 4,
			1.2,
			700,
			new Vector3(0, 100, 0),
			this._scene,
		);
		this._activeCamera.attachControl();
		this._activeCamera.lowerBetaLimit = 0.2;
		this._activeCamera.upperBetaLimit = 1.45;
		this._activeCamera.lowerRadiusLimit = 400;
		this._activeCamera.upperRadiusLimit = 1000;
		this._activeCamera.panningSensibility = 0;
		this._activeCamera.wheelDeltaPercentage = 0.01;
		this._activeCamera.inertia = 0.8;
		return this._activeCamera;
	}

	private _createIsoCamera(): ArcRotateCamera {
		this._activeCamera = new ArcRotateCamera(
			"isoCamera",
			-Math.PI / 4,
			1.2,
			700,
			new Vector3(0, 100, 0),
			this._scene,
		);
		this._activeCamera.mode = Camera.ORTHOGRAPHIC_CAMERA;
		this._activeCamera.alpha = -Math.PI / 4;          // 45° Yaw, wie Follow-Kamera
		this._activeCamera.beta = Math.atan(Math.SQRT2);  // ≈ 0.9553 rad → echte Iso-Elevation 35,26°
		this._activeCamera.radius = 2000;
		this._activeCamera.lowerRadiusLimit = this._activeCamera.upperRadiusLimit = 2000;
		this._activeCamera.minZ = 0.1;
		this._activeCamera.maxZ = 10000;
		return this._activeCamera;
	}

	get activeCamera(): ArcRotateCamera {
		return this._activeCamera!;
	}

	follow(target: AbstractMesh): void {
		this.activeCamera?.setTarget(target, true, false, true);
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

	_updateOrhtoBounds() {

	}

	dispose() {

	}


}