import { AbstractCamera, AbstractObject, Vector3, Matrix4Utils } from "@core";
import { LikeVector3 } from "@core/types";

const lookAtVector3 = new Vector3();

export class PerspectiveCamera extends AbstractCamera {
	private _lookAt: AbstractObject | LikeVector3 | null;

	constructor(public fov: number, public far: number, public near: number) {
		super();
		this._lookAt = null;
	}

	public lookAt(vectorOrRenderTarget: AbstractObject | LikeVector3 | null): PerspectiveCamera {
		this._lookAt = vectorOrRenderTarget;
		return this;
	}

	public updateProjectionMatrix(viewportWidth: number, viewportHeight: number): void {
		const f = Math.tan(Math.PI * 0.5 - 0.5 * this.fov);
		const rangeInv = 1.0 / (this.near - this.far);
		const aspect = viewportWidth / viewportHeight;

		// prettier-ignore
		this.projectionMatrix.copy([
			f / aspect, 0, 0, 0,
			0, f, 0, 0,
			0, 0, (this.near + this.far) * rangeInv, -1,
			0, 0, this.near * this.far * rangeInv * 2, 0
		]);

		this.viewMatrix
			.toIdentity()
			.xRotate(this.rotation.x)
			.yRotate(this.rotation.y)
			.zRotate(this.rotation.z)
			.translate(this.position);

		if (this._lookAt) {
			if (this._lookAt instanceof AbstractObject) {
				lookAtVector3.copy(this._lookAt.position);
			} else {
				lookAtVector3.copy(this._lookAt);
			}

			const viewMatrixArray = this.viewMatrix.toArray();
			const cameraPosition: LikeVector3 = [
				viewMatrixArray[12],
				viewMatrixArray[13],
				viewMatrixArray[14],
			];

			let lookAtMatrix = Matrix4Utils.createLookAt(cameraPosition, lookAtVector3, [0, 1, 0]);
			lookAtMatrix = Matrix4Utils.toInvert(lookAtMatrix);
			this.viewMatrix.copy(lookAtMatrix);
		}
	}
}
