import { generateId } from "@core/shared/helpers/generateId";
import { Matrix4 } from "@core/shared/math/Matrix4";
import { Vector3 } from "@core/shared/math/Vector3";

import type { LikeMatrix4 } from "@core/types";

export abstract class AbstractRenderTarget {
	public id: string;
	public zIndex: number;
	public hidden: boolean;
	public scale: Vector3;
	public position: Vector3;
	public rotation: Vector3;
	public translate: Vector3;
	public transformMatrix: Matrix4;

	constructor() {
		this.id = generateId();
		this.zIndex = 0;
		this.hidden = false;

		this.scale = new Vector3([1, 1, 1]);
		this.position = new Vector3();
		this.rotation = new Vector3();
		this.translate = new Vector3();

		this.transformMatrix = new Matrix4();
	}

	public updateTransformMatrix(transformMatrix?: LikeMatrix4): void {
		if (transformMatrix) {
			this.transformMatrix.copy(transformMatrix);
		} else {
			this.transformMatrix.toIdentity();
		}

		this.transformMatrix
			.translate(this.position)
			.translate(this.translate)
			.xRotate(this.rotation.x)
			.yRotate(this.rotation.y)
			.zRotate(this.rotation.z)
			.scale(this.scale);
	}
}
