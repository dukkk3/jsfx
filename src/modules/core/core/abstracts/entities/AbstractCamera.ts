import { Matrix4 } from "@core/math/Matrix4";
import { Vector3 } from "@core/math/Vector3";

export abstract class AbstractCamera {
	public projectionMatrix: Matrix4;
	public viewMatrix: Matrix4;
	public rotation: Vector3;
	public position: Vector3;

	constructor() {
		this.projectionMatrix = new Matrix4();
		this.viewMatrix = new Matrix4();
		this.position = new Vector3();
		this.rotation = new Vector3();
	}

	public abstract updateProjectionMatrix(viewportWidth: number, viewportHeight: number): void;
}
