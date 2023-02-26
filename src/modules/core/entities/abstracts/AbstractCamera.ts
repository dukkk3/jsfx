import { Vector3 } from "@core/shared/math/Vector3";

import type { Matrix4 } from "@core/shared/math/Matrix4";
import type { LikeVector3 } from "@core/types";

export abstract class AbstractCamera {
	public position: Vector3;
	public rotation: Vector3;

	constructor(position: LikeVector3 = new Vector3()) {
		this.position = new Vector3(position);
		this.rotation = new Vector3();
	}

	public abstract getViewMatrix(viewportWidth: number, viewportHeight: number): Matrix4;
}
