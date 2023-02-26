import { mat4 } from "gl-matrix";

import { Vector3Utils } from "./Vector3Utils";
import type {
	ArrayOfMatrix4Components,
	ArrayOfVector4Components,
	LikeMatrix4,
	LikeVector3,
} from "../../types";

export class Matrix4Utils {
	public static createEmpty(): ArrayOfMatrix4Components {
		return [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	}

	public static matrixToArray(matrix: LikeMatrix4): ArrayOfMatrix4Components {
		if ("toArray" in matrix) {
			return matrix.toArray();
		}

		// prettier-ignore
		return Array.isArray(matrix) ? [...matrix] : [
			matrix.m00, matrix.m01, matrix.m02, matrix.m03,
			matrix.m10, matrix.m11, matrix.m12, matrix.m13,
			matrix.m20, matrix.m21, matrix.m22, matrix.m23,
			matrix.m30, matrix.m31, matrix.m32, matrix.m33,
		];
	}

	public static toInvert(matrix: LikeMatrix4): ArrayOfMatrix4Components {
		const newMatrix = this.createEmpty();
		mat4.invert(newMatrix, this.matrixToArray(matrix));
		return newMatrix;
	}

	public static createIdentity(): ArrayOfMatrix4Components {
		const matrix = this.createEmpty();
		mat4.identity(matrix);
		return matrix;
	}

	public static createRotation(angleInRadians: number, axis: LikeVector3): ArrayOfMatrix4Components {
		const matrix = this.createEmpty();
		mat4.fromRotation(matrix, angleInRadians, Vector3Utils.vectorToArray(axis));
		return matrix;
	}

	public static createXRotation(angleInRadians: number): ArrayOfMatrix4Components {
		const matrix = this.createEmpty();
		mat4.fromXRotation(matrix, angleInRadians);
		return matrix;
	}

	public static createYRotation(angleInRadians: number): ArrayOfMatrix4Components {
		const matrix = this.createEmpty();
		mat4.fromYRotation(matrix, angleInRadians);
		return matrix;
	}

	public static createZRotation(angleInRadians: number): ArrayOfMatrix4Components {
		const matrix = this.createEmpty();
		mat4.fromZRotation(matrix, angleInRadians);
		return matrix;
	}

	public static createTranslation(translation: LikeVector3): ArrayOfMatrix4Components {
		const matrix = this.createEmpty();
		mat4.fromTranslation(matrix, Vector3Utils.vectorToArray(translation));
		return matrix;
	}

	public static createScaling(scaling: LikeVector3): ArrayOfMatrix4Components {
		const matrix = this.createEmpty();
		mat4.fromScaling(matrix, Vector3Utils.vectorToArray(scaling));
		return matrix;
	}

	public static createProjection(
		width: number,
		height: number,
		depth: number
	): ArrayOfMatrix4Components {
		const matrix = this.createIdentity();
		matrix[0] = 2 / width;
		matrix[5] = -2 / height;
		matrix[10] = 2 / depth;
		return matrix;
	}

	public static createLookAt(
		position: LikeVector3,
		target: LikeVector3,
		up: LikeVector3
	): ArrayOfMatrix4Components {
		const cameraPosition = Vector3Utils.vectorToArray(position);
		const zAxis = Vector3Utils.normalize(Vector3Utils.subtract(position, target));
		const xAxis = Vector3Utils.normalize(Vector3Utils.cross(up, zAxis));
		const yAxis = Vector3Utils.normalize(Vector3Utils.cross(zAxis, xAxis));

		return [
			xAxis[0],
			xAxis[1],
			xAxis[2],
			0,
			yAxis[0],
			yAxis[1],
			yAxis[2],
			0,
			zAxis[0],
			zAxis[1],
			zAxis[2],
			0,
			cameraPosition[0],
			cameraPosition[1],
			cameraPosition[2],
			1,
		];
	}

	public static rotate(
		matrix: LikeMatrix4,
		angleInRadians: number,
		axis: LikeVector3
	): ArrayOfMatrix4Components {
		return this.multiply(matrix, this.createRotation(angleInRadians, axis));
	}

	public static xRotate(matrix: LikeMatrix4, angleInRadians: number): ArrayOfMatrix4Components {
		return this.multiply(matrix, this.createXRotation(angleInRadians));
	}

	public static yRotate(matrix: LikeMatrix4, angleInRadians: number): ArrayOfMatrix4Components {
		return this.multiply(matrix, this.createYRotation(angleInRadians));
	}

	public static zRotate(matrix: LikeMatrix4, angleInRadians: number): ArrayOfMatrix4Components {
		return this.multiply(matrix, this.createZRotation(angleInRadians));
	}

	public static translate(matrix: LikeMatrix4, translation: LikeVector3): ArrayOfMatrix4Components {
		return this.multiply(matrix, this.createTranslation(translation));
	}

	public static scale(matrix: LikeMatrix4, scaling: LikeVector3): ArrayOfMatrix4Components {
		return this.multiply(matrix, this.createScaling(scaling));
	}

	public static multiply(a: LikeMatrix4, b: LikeMatrix4): ArrayOfMatrix4Components {
		const newMatrix = this.createEmpty();
		mat4.multiply(newMatrix, this.matrixToArray(a), this.matrixToArray(b));
		return newMatrix;
	}

	public static vectorMultiply(
		matrix: LikeMatrix4,
		vector: ArrayOfVector4Components
	): ArrayOfMatrix4Components {
		const newMatrix = this.createEmpty();
		const m = this.matrixToArray(matrix);
		for (let i = 0; i < 4; ++i) {
			newMatrix[i] = 0.0;
			for (let j = 0; j < 4; ++j) {
				newMatrix[i] += vector[j] * m[j * 4 + i];
			}
		}
		return newMatrix;
	}
}
