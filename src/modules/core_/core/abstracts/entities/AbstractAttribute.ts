import type {
	AttributeSetter,
	TypedArrayConstructorKind,
	WebGLRenderingContextKind,
} from "core_/types";

export type AttributeArray<T extends TypedArrayConstructorKind> =
	| number[]
	| number[][]
	| InstanceType<T>;

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

		return array;
	}

	private _typedArray: InstanceType<T>;

	constructor(
		private _arrayConstructor: T,
		public array: AttributeArray<T>,
		public componentSize: number,
		private _options: { normalize?: boolean; dynamicDraw?: boolean } = {}
	) {
		this._typedArray = AbstractAttribute.arrayToTypedArray(_arrayConstructor, array);
	}

	public updateArray(array: AttributeArray<T>): void {
		this._typedArray = AbstractAttribute.arrayToTypedArray(this._arrayConstructor, array);
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
