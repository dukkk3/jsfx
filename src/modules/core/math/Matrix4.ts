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

	public rotate(angleInRadians: number, axis: LikeVector3): this {
		return this.multiply(Matrix4Utils.createRotation(angleInRadians, axis));
	}

	public xRotate(angleInRadians: number): this {
		return this.multiply(Matrix4Utils.createXRotation(angleInRadians));
	}

	public yRotate(angleInRadians: number): this {
		return this.multiply(Matrix4Utils.createYRotation(angleInRadians));
	}

	public zRotate(angleInRadians: number): this {
		return this.multiply(Matrix4Utils.createZRotation(angleInRadians));
	}

	public translate(translation: LikeVector3): this {
		return this.multiply(Matrix4Utils.createTranslation(translation));
	}

	public scale(scaling: LikeVector3): this {
		return this.multiply(Matrix4Utils.createScaling(scaling));
	}

	public toInvert(): this {
		return this.copy(Matrix4Utils.toInvert(this));
	}

	public toIdentity(): this {
		return this.copy(Matrix4Utils.createIdentity());
	}

	public multiply(matrix: LikeMatrix4): this {
		return this.copy(Matrix4Utils.multiply(this, matrix));
	}

	public copy(matrix: LikeMatrix4): this {
		this._matrix = Matrix4Utils.matrixToArray(matrix);
		return this;
	}

	public lookAt(position: LikeVector3, target: LikeVector3, up: LikeVector3): this {
		return this.copy(Matrix4Utils.createLookAt(position, target, up));
	}

	public toArray(): ArrayOfMatrix4Components {
		return [...this._matrix];
	}

	public clone(): Matrix4 {
		return new Matrix4(this);
	}
}
