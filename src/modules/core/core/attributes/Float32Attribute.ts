import { WebGLRenderingContextKind } from "@core/types";
import {
	AbstractAttribute,
	AttributeOptions,
	AttributeArray,
} from "../abstracts/entities/AbstractAttribute";

export class Float32Attribute extends AbstractAttribute<Float32ArrayConstructor> {
	constructor(
		array: AttributeArray<Float32ArrayConstructor>,
		componentSize: number,
		options?: AttributeOptions
	) {
		super(Float32Array, array, componentSize, options);
	}

	protected getTypeByContext(context: WebGLRenderingContextKind): number {
		return context.FLOAT;
	}
}
