import { mat3 } from "gl-matrix";

import type { ArrayOfMatrix3Components, LikeMatrix3 } from "../../types";

export class Matrix3Utils {
	private static createEmpty(): ArrayOfMatrix3Components {
		return [0, 0, 0, 0, 0, 0, 0, 0, 0];
	}

	public static createIdentity(): ArrayOfMatrix3Components {
		const matrix = this.createEmpty();
		mat3.identity(matrix);
		return matrix;
	}

	public static matrixToArray(matrix: LikeMatrix3): ArrayOfMatrix3Components {
		if ("toArray" in matrix) {
			return matrix.toArray();
		}

		// prettier-ignore
		return Array.isArray(matrix) ? matrix : [
			matrix.m00, matrix.m01, matrix.m02,
			matrix.m10, matrix.m11, matrix.m12,
			matrix.m20, matrix.m11, matrix.m22,
		]
	}

	public static createProjection(width: number, height: number): ArrayOfMatrix3Components {
		const matrix = this.createEmpty();
		mat3.projection(matrix, width, height);
		return matrix;
	}

	public static createRotation(angleInRadians: number): ArrayOfMatrix3Components {
		const matrix = this.createEmpty();
		mat3.fromRotation(matrix, angleInRadians);
		return matrix;
	}

	public static createTranslation(x: number, y: number): ArrayOfMatrix3Components {
		const matrix = this.createEmpty();
		mat3.fromTranslation(matrix, [x, y]);
		return matrix;
	}

	public static createScaling(x: number, y: number): ArrayOfMatrix3Components {
		const matrix = this.createEmpty();
		mat3.fromScaling(matrix, [x, y]);
		return matrix;
	}

	public static rotate(matrix: LikeMatrix3, angleInRadians: number): ArrayOfMatrix3Components {
		return this.multiply(matrix, this.createRotation(angleInRadians));
	}

	public static translate(matrix: LikeMatrix3, x: number, y: number): ArrayOfMatrix3Components {
		return this.multiply(matrix, this.createTranslation(x, y));
	}

	public static scale(matrix: LikeMatrix3, x: number, y: number): ArrayOfMatrix3Components {
		return this.multiply(matrix, this.createScaling(x, y));
	}

	public static multiply(a: LikeMatrix3, b: LikeMatrix3): ArrayOfMatrix3Components {
		const newMatrix = this.createEmpty();
		mat3.multiply(newMatrix, this.matrixToArray(a), this.matrixToArray(b));
		return newMatrix;
	}
}
