import { CacheStore, createCacheStore } from "@core/shared/helpers/createCacheStore";
import { generateId } from "@core/shared/helpers/generateId";
import { UnitType } from "@core/shared/enums/unitType";

import type { TypedArrayConstructorKind } from "@core/types";

const getTypedArrayInstance = <T extends new (array: any[]) => any>(
	constructor: T,
	array: any[] | InstanceType<T>
): InstanceType<T> => {
	return Array.isArray(array) ? new constructor(array) : array;
};

export abstract class AbstractAttribute<
	T extends TypedArrayConstructorKind = TypedArrayConstructorKind
> {
	public readonly id: string;
	public readonly componentsCount: number;

	private _updatedAt: number;
	private _compiledArray: InstanceType<T>;
	private _findBuffer: CacheStore<{ timestamp: number; buffer: WebGLBuffer }, WebGLRenderingContext>;

	constructor(
		private readonly _arrayConstructor: T,
		public readonly type: UnitType,
		array: number[] | InstanceType<T>,
		public readonly componentSize: number,
		public readonly normalize: boolean = false,
		public readonly dynamicDraw: boolean = false
	) {
		this.id = generateId();
		this.normalize = normalize;
		this.componentsCount = array.length / componentSize;

		this._updatedAt = Date.now();
		this._findBuffer = createCacheStore();
		this._compiledArray = getTypedArrayInstance(_arrayConstructor, array);
	}

	public getArray(): InstanceType<T> {
		return this._compiledArray;
	}

	public updateArray(array: number[] | InstanceType<T>): void {
		this._compiledArray = getTypedArrayInstance(this._arrayConstructor, array);
		this._updatedAt = Date.now();
	}

	public getBufferByContext(context: WebGLRenderingContext): WebGLBuffer {
		return this._findBuffer(
			context,
			(key) => key === context,
			() => {
				const buffer = context.createBuffer()!;
				this.provideBufferData(buffer, context);
				return { buffer, timestamp: this._updatedAt };
			},
			(item) => {
				if (item.timestamp !== this._updatedAt) {
					this.provideBufferData(item.buffer, context);
					return item;
				}

				return null;
			}
		).buffer;
	}

	private provideBufferData(buffer: WebGLBuffer, context: WebGLRenderingContext): void {
		context.bindBuffer(context.ARRAY_BUFFER, buffer);
		context.bufferData(
			context.ARRAY_BUFFER,
			this._compiledArray,
			this.dynamicDraw ? context.STATIC_DRAW : context.DYNAMIC_DRAW
		);
	}
}
