import { Matrix4 } from "@core/shared/math/Matrix4";

export abstract class AbstractCamera {
	public projectionMatrix: Matrix4;

	constructor() {
		this.projectionMatrix = new Matrix4();
	}
}
