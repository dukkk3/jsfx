import {
	LikeMatrix4,
	LikeVector3,
	ArrayOfMatrix4Components,
	ObjectWithSerializationToArray,
} from "@core/types";

import { Matrix4Utils } from "./Matrix4Utils";

export class Matrix4 implements ObjectWithSerializationToArray<ArrayOfMatrix4Components> {
	private _matrix: ArrayOfMatrix4Components;

	constructor(matrix: LikeMatrix4 = Matrix4Utils.createIdentity()) {
		this._matrix = Matrix4Utils.matrixToArray(matrix);
	}

	public rotate(angleInRadians: number, axis: LikeVector3): Matrix4 {
		return this.multiply(Matrix4Utils.createRotation(angleInRadians, axis));
	}

	public xRotate(angleInRadians: number): Matrix4 {
		return this.multiply(Matrix4Utils.createXRotation(angleInRadians));
	}

	public yRotate(angleInRadians: number): Matrix4 {
		return this.multiply(Matrix4Utils.createYRotation(angleInRadians));
	}

	public zRotate(angleInRadians: number): Matrix4 {
		return this.multiply(Matrix4Utils.createZRotation(angleInRadians));
	}

	public translate(translation: LikeVector3): Matrix4 {
		return this.multiply(Matrix4Utils.createTranslation(translation));
	}

	public scale(scaling: LikeVector3): Matrix4 {
		return this.multiply(Matrix4Utils.createScaling(scaling));
	}

	public toInvert(): Matrix4 {
		return this.copy(Matrix4Utils.toInvert(this));
	}

	public toIdentity(): Matrix4 {
		return this.copy(Matrix4Utils.createIdentity());
	}

	public multiply(matrix: LikeMatrix4): Matrix4 {
		return this.copy(Matrix4Utils.multiply(this, matrix));
	}

	public copy(matrix: LikeMatrix4): Matrix4 {
		this._matrix = Matrix4Utils.matrixToArray(matrix);
		return this;
	}

	public lookAt(position: LikeVector3, target: LikeVector3, up: LikeVector3): Matrix4 {
		return this.copy(Matrix4Utils.createLookAt(position, target, up));
	}

	public toArray(): ArrayOfMatrix4Components {
		return [...this._matrix];
	}
}
