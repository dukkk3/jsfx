export type WebGLRenderingContextKind = WebGLRenderingContext | WebGL2RenderingContext;

export type TypedArrayConstructorKind = Uint8ArrayConstructor | Float32ArrayConstructor;
export type TypedArrayKind = InstanceType<TypedArrayConstructorKind>;

export type UniformValue =
	| number
	| boolean
	| number[]
	| boolean[]
	| ObjectWithSerializationToArray<number[]>;
export type Uniforms = Record<string, UniformValue>;

export interface AttributeSetterData {
	type?: number;
	componentSize?: number;
	normalize?: boolean;
	buffer?: WebGLBuffer;
	value?: Float32Array;
	stride?: number;
	offset?: number;
}

export type AttributeSetter = (data: AttributeSetterData) => void;

export interface ObjectOfVector3Components {
	x: number;
	y: number;
	z: number;
}

export interface ObjectOfVector4Components extends ObjectOfVector3Components {
	a: number;
}

export interface ObjectOfMatrix3Components {
	m00: number;
	m01: number;
	m02: number;
	m10: number;
	m11: number;
	m12: number;
	m20: number;
	m21: number;
	m22: number;
}

export interface ObjectOfMatrix4Components extends ObjectOfMatrix3Components {
	m03: number;
	m13: number;
	m23: number;
	m30: number;
	m31: number;
	m32: number;
	m33: number;
}

export interface ObjectWithSerializationToArray<T extends any[]> {
	toArray(): T;
}

export type LikeVector3 =
	| ArrayOfVector3Components
	| ObjectOfVector3Components
	| ObjectWithSerializationToArray<ArrayOfVector3Components>;
export type LikeVector4 =
	| ArrayOfVector4Components
	| ObjectOfVector4Components
	| ObjectWithSerializationToArray<ArrayOfVector4Components>;
export type LikeMatrix3 =
	| ArrayOfMatrix3Components
	| ObjectOfMatrix3Components
	| ObjectWithSerializationToArray<ArrayOfMatrix3Components>;
export type LikeMatrix4 =
	| ArrayOfMatrix4Components
	| ObjectOfMatrix4Components
	| ObjectWithSerializationToArray<ArrayOfMatrix4Components>;

export type ArrayOfVector3Components = [x: number, y: number, z: number];
export type ArrayOfVector4Components = [x: number, y: number, z: number, a: number];

export type ArrayOfMatrix3Components = [
	m00: number,
	m01: number,
	m02: number,
	m10: number,
	m11: number,
	m12: number,
	m20: number,
	m21: number,
	m22: number
];

export type ArrayOfMatrix4Components = [
	m00: number,
	m01: number,
	m02: number,
	m03: number,
	m10: number,
	m11: number,
	m12: number,
	m13: number,
	m20: number,
	m21: number,
	m22: number,
	m23: number,
	m30: number,
	m31: number,
	m32: number,
	m33: number
];

export type DeepPropType<T, P extends string> = string extends P
	? unknown
	: P extends keyof T
	? T[P]
	: P extends `${infer K}.${infer R}`
	? K extends keyof T
		? DeepPropType<T[K], R>
		: unknown
	: unknown;

export type DeepPropsPaths<T, V, D extends number = 3> = [D] extends [never]
	? never
	: T extends V
	? ""
	: T extends object
	? { [K in keyof T]-?: JoinKeys<K, DeepPropsPaths<T[K], Prev[D]>> }[keyof T]
	: "";

export type DeepPropsTypeReplacer<T, V, R, D extends number = 3> = [D] extends [never]
	? never
	: T extends V
	? R
	: T extends object
	? { [K in keyof T]-?: DeepPropsTypeReplacer<T[K], V, R, D> }
	: R;

type JoinKeys<K, U> = K extends string | number
	? U extends string | number
		? `${K}${"" extends U ? "" : "."}${U}`
		: never
	: never;

type Prev = [never, 0, 1, 2, 3, 4, 5, 6, ...0[]];
