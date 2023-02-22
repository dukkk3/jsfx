import type { Vector2 } from "@core/math/Vector2";
import type { Vector3 } from "@core/math/Vector3";
import type { Matrix3 } from "@core/math/Matrix3";

export type UniformValue = number | boolean | number[] | boolean[];

export type Vector2Array = [x: number, y: number];
export type Vector3Array = [x: number, y: number, z: number];
export type LikeVector3 = Vector3 | Vector3Array;
export type LikeVector2 = Vector2 | Vector2Array;

export type Matrix3Array = [number, number, number, number, number, number, number, number, number];
export type Matrix4Array = [
	number,
	number,
	number,
	number,
	number,
	number,
	number,
	number,
	number,
	number,
	number,
	number,
	number,
	number,
	number,
	number
];
export type LikeMatrix3 = Matrix3 | Matrix3Array;
// export type LikeMatrix4 = Matrix4 | Matrix4Array;

export type WebGLContext = WebGLRenderingContext | WebGL2RenderingContext;
