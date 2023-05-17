import { createId } from "@core/common/createId";
import { Vector3 } from "@core/math/Vector3";
import { Matrix4 } from "@core/math/Matrix4";
import { LikeMatrix4 } from "@core/types";
import type { AbstractScene } from "./AbstractScene";

export abstract class AbstractObject {
	public readonly id: string;

	public zIndex: number;
	public scale: Vector3;
	public hidden: boolean;
	public position: Vector3;
	public rotation: Vector3;
	public worldMatrix: Matrix4;
	public parent: AbstractObject | null;

	constructor(public readonly scene: AbstractScene) {
		this.zIndex = 0;
		this.parent = null;
		this.hidden = false;
		this.id = createId();
		this.position = new Vector3();
		this.rotation = new Vector3();
		this.scale = new Vector3([1, 1, 1]);
		this.worldMatrix = new Matrix4();
	}

	public setParent(parent: AbstractObject | null): void {
		if (parent === this || (parent && parent.scene !== this.scene)) return;
		this.parent = parent;
		this.scene.updateObjectsTree();
	}

	public applyMatrix(matrix: LikeMatrix4): Matrix4 {
		return this.worldMatrix
			.copy(matrix)
			.translate(this.position)
			.xRotate(this.rotation.x)
			.yRotate(this.rotation.y)
			.zRotate(this.rotation.z)
			.scale(this.scale);
	}

	public getRecursiveProjectionMatrix(matrix?: Matrix4): Matrix4 {
		const projectionMatrix = matrix || new Matrix4();

		if (this.parent) {
			projectionMatrix.copy(this.parent.updateProjectionMatrix());
		} else {
			projectionMatrix.toIdentity();
		}

		return projectionMatrix
			.translate(this.position)
			.xRotate(this.rotation.x)
			.yRotate(this.rotation.y)
			.zRotate(this.rotation.z)
			.scale(this.scale);
	}

	public updateProjectionMatrix(): Matrix4 {
		return this.getRecursiveProjectionMatrix(this.worldMatrix);
	}
}
