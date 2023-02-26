import { Matrix4 } from "@core/shared/math/Matrix4";
import { Vector3 } from "@core/shared/math/Vector3";
import { AbstractCamera, AbstractRenderTarget } from "@core/index";
import { LikeVector3 } from "@core/types";
import { Matrix4Utils } from "@core/shared/math/Matrix4Utils";

const lookAtVector3 = new Vector3();

export class PerspectiveCamera extends AbstractCamera {
	private _viewMatrix: Matrix4;
	private _lookAtMatrix: Matrix4;
	private _projectionMatrix: Matrix4;
	private _lookAt: AbstractRenderTarget | LikeVector3 | null;

	constructor(public fov: number, public far: number, public near: number) {
		super();
		this._projectionMatrix = new Matrix4();
		this._lookAtMatrix = new Matrix4();
		this._viewMatrix = new Matrix4();
		this._lookAt = null;
	}

	public lookAt(vectorOrRenderTarget: AbstractRenderTarget | LikeVector3 | null): PerspectiveCamera {
		this._lookAt = vectorOrRenderTarget;
		return this;
	}

	public getViewMatrix(viewportWidth: number, viewportHeight: number): Matrix4 {
		const f = Math.tan(Math.PI * 0.5 - 0.5 * this.fov);
		const rangeInv = 1.0 / (this.near - this.far);
		const aspect = viewportWidth / viewportHeight;

		// prettier-ignore
		this._projectionMatrix.copy([
			f / aspect, 0, 0, 0,
			0, f, 0, 0,
			0, 0, (this.near + this.far) * rangeInv, -1,
			0, 0, this.near * this.far * rangeInv * 2, 0
		]);

		this._viewMatrix
			.toIdentity()
			.xRotate(this.rotation.x)
			.yRotate(this.rotation.y)
			.zRotate(this.rotation.z)
			.translate(this.position);

		if (this._lookAt) {
			if (this._lookAt instanceof AbstractRenderTarget) {
				lookAtVector3.copy(this._lookAt.position).add(this._lookAt.translate);
			} else {
				lookAtVector3.copy(this._lookAt);
			}

			const viewMatrixArray = this._viewMatrix.toArray();
			const cameraPosition: LikeVector3 = [
				viewMatrixArray[12],
				viewMatrixArray[13],
				viewMatrixArray[14],
			];

			let lookAtMatrix = Matrix4Utils.createLookAt(cameraPosition, lookAtVector3, [0, 1, 0]);
			lookAtMatrix = Matrix4Utils.toInvert(lookAtMatrix);
			this._viewMatrix.copy(lookAtMatrix);
		}

		return this._projectionMatrix.multiply(this._viewMatrix);
	}
}
