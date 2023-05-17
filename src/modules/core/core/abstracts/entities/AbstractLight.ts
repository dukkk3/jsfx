import { Vector3 } from "@core/math/Vector3";

export abstract class AbstractLight {
	public position: Vector3;
	public rotation: Vector3;

	constructor() {
		this.position = new Vector3();
		this.rotation = new Vector3();
	}

	public abstract getLight(): Vector3;
}
