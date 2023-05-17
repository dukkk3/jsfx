import type {
	AttributeSetter,
	TypedArrayConstructorKind,
	WebGLRenderingContextKind,
} from "@core/types";

export type AttributeArray<T extends TypedArrayConstructorKind> =
	| number[]
	| number[][]
	| InstanceType<T>
	| AbstractAttribute<T>;

export interface AttributeOptions {
	normalize?: boolean;
	dynamicDraw?: boolean;
}

export abstract class AbstractAttribute<
	T extends TypedArrayConstructorKind = TypedArrayConstructorKind
> {
	public static arrayToTypedArray<T extends TypedArrayConstructorKind>(
		constructor: T,
		array: AttributeArray<T>
	): InstanceType<T> {
		if (Array.isArray(array)) {
			return new constructor(array.flat(1)) as InstanceType<T>;
		}

		if ("getTypedArray" in array) {
			return array.getTypedArray();
		}

		return array;
	}

	public readonly componentSize: number;
	public readonly componentsCount: number;

	private _array: number[];
	private _arrayConstructor: T;
	private _typedArray: InstanceType<T>;
	private _options: AttributeOptions;

	constructor(
		arrayConstructor: T,
		array: AttributeArray<T>,
		componentSize: number,
		options: AttributeOptions = {}
	) {
		this._options = options;
		this._arrayConstructor = arrayConstructor;
		this._typedArray = AbstractAttribute.arrayToTypedArray(arrayConstructor, array);
		this._array = [...this._typedArray];
		this.componentsCount = this._typedArray.length / componentSize;
		this.componentSize = componentSize;
	}

	public updateArray(array: AttributeArray<T>): void {
		this._typedArray = AbstractAttribute.arrayToTypedArray(this._arrayConstructor, array);
		this._array = [...this._typedArray];
	}

	public getArray() {
		return this._array;
	}

	public getTypedArray() {
		return this._typedArray;
	}

	public provideBufferInContext(
		context: WebGLRenderingContextKind,
		buffer: WebGLBuffer,
		setter: AttributeSetter
	): void {
		setter({
			buffer,
			normalize: this._options?.normalize,
			componentSize: this.componentSize,
			type: this.getTypeByContext(context),
		});
	}

	public provideArrayInBufferByContext(
		context: WebGLRenderingContextKind,
		buffer: WebGLBuffer
	): void {
		context.bindBuffer(context.ARRAY_BUFFER, buffer);
		context.bufferData(
			context.ARRAY_BUFFER,
			this._typedArray,
			this._options.dynamicDraw ? context.DYNAMIC_DRAW : context.STATIC_DRAW
		);
	}

	protected abstract getTypeByContext(context: WebGLRenderingContextKind): number;
}
