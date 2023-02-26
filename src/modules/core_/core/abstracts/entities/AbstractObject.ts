import { createId } from "core_/common/createId";
import { Vector3 } from "core_/math/Vector3";
import { Matrix4 } from "core_/math/Matrix4";
import type { AbstractScene } from "./AbstractScene";
import { LikeMatrix4 } from "@core/types";

export abstract class AbstractObject {
	public readonly id: string;

	public zIndex: number;
	public scale: Vector3;
	public hidden: boolean;
	public position: Vector3;
	public rotation: Vector3;
	public translation: Vector3;
	public projectionMatrix: Matrix4;
	public parent: AbstractObject | null;

	constructor(public readonly scene: AbstractScene) {
		this.zIndex = 0;
		this.parent = null;
		this.hidden = false;
		this.id = createId();
		this.position = new Vector3();
		this.rotation = new Vector3();
		this.translation = new Vector3();
		this.scale = new Vector3([1, 1, 1]);
		this.projectionMatrix = new Matrix4();
	}

	public setParent(parent: AbstractObject | null): void {
		if (parent === this || (parent && parent.scene !== this.scene)) return;
		this.parent = parent;
		this.scene.updateObjectsTree();
	}

	public applyMatrix(matrix: LikeMatrix4): Matrix4 {
		return this.projectionMatrix
			.copy(matrix)
			.translate(this.position)
			.translate(this.translation)
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
			.translate(this.translation)
			.xRotate(this.rotation.x)
			.yRotate(this.rotation.y)
			.zRotate(this.rotation.z)
			.scale(this.scale);
	}

	public updateProjectionMatrix(): Matrix4 {
		return this.getRecursiveProjectionMatrix(this.projectionMatrix);
	}
}
