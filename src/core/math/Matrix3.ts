import { mat3 } from "gl-matrix";

import type { LikeMatrix3, Matrix3Array } from "@core/types";

export class Matrix3 {
	public static identity(): Matrix3 {
		const matrix = this.arrayFromIdentity();
		return new Matrix3(matrix);
	}

	public static arrayFromIdentity(): Matrix3Array {
		const matrix = this.createEmptyMatrixArray();
		mat3.identity(matrix);
		return matrix;
	}

	public static arrayFromProjection(width: number, height: number): Matrix3Array {
		const matrix = this.createEmptyMatrixArray();
		mat3.projection(matrix, width, height);
		return matrix;
	}

	public static projection(width: number, height: number): Matrix3 {
		const matrix = this.arrayFromProjection(width, height);
		return new Matrix3(matrix);
	}

	public static fromRotation(radians: number = 0): Matrix3 {
		const matrix = this.arrayFromRotation(radians);
		return new Matrix3(matrix);
	}

	public static fromTranslation(x: number = 0, y: number = 0): Matrix3 {
		const matrix = this.arrayFromTranslation(x, y);
		return new Matrix3(matrix);
	}

	public static fromScaling(x: number = 1, y: number = 1): Matrix3 {
		const matrix = this.arrayFromScaling(x, y);
		return new Matrix3(matrix);
	}

	public static arrayFromRotation(radians: number = 0): Matrix3Array {
		const matrix = this.createEmptyMatrixArray();
		mat3.fromRotation(matrix, radians);
		return matrix;
	}

	public static arrayFromTranslation(x: number = 0, y: number = 0): Matrix3Array {
		const matrix = this.createEmptyMatrixArray();
		mat3.fromTranslation(matrix, [x, y]);
		return matrix;
	}

	public static arrayFromScaling(x: number = 1, y: number = 1): Matrix3Array {
		const matrix = this.createEmptyMatrixArray();
		mat3.fromScaling(matrix, [x, y]);
		return matrix;
	}

	public static createEmptyMatrixArray(): Matrix3Array {
		return [0, 0, 0, 0, 0, 0, 0, 0, 0];
	}

	private static getArrayFromMatrix(matrix: LikeMatrix3): Matrix3Array {
		if (Array.isArray(matrix)) return matrix;
		return matrix.toArray();
	}

	constructor(private _matrix: Matrix3Array = Matrix3.createEmptyMatrixArray()) {}

	public toArray(): Matrix3Array {
		return [...this._matrix];
	}

	public add(matrix: LikeMatrix3): Matrix3 {
		mat3.add(this._matrix, this._matrix, Matrix3.getArrayFromMatrix(matrix));
		return this;
	}

	public sub(matrix: LikeMatrix3): Matrix3 {
		mat3.sub(this._matrix, this._matrix, Matrix3.getArrayFromMatrix(matrix));
		return this;
	}

	public rotate(angle: number): Matrix3 {
		mat3.rotate(this._matrix, this._matrix, angle);
		return this;
	}

	public multiply(matrix: LikeMatrix3): Matrix3 {
		mat3.multiply(this._matrix, this._matrix, Matrix3.getArrayFromMatrix(matrix));
		return this;
	}

	public copy(matrix: LikeMatrix3): Matrix3 {
		if (Array.isArray(matrix)) {
			this._matrix = [...matrix];
		} else {
			this._matrix = matrix.toArray();
		}

		return this;
	}

	public toIdentity(): Matrix3 {
		this.copy(Matrix3.arrayFromIdentity());
		return this;
	}

	public toProjection(width: number, height: number): Matrix3 {
		this.copy(Matrix3.arrayFromProjection(width, height));
		return this;
	}
}
