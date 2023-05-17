import { WebGLRenderingContextKind } from "@core/types";
import {
	AbstractAttribute,
	AttributeOptions,
	AttributeArray,
} from "../abstracts/entities/AbstractAttribute";

export class Uint8Attribute extends AbstractAttribute<Uint8ArrayConstructor> {
	constructor(
		array: AttributeArray<Uint8ArrayConstructor>,
		componentSize: number,
		options?: AttributeOptions
	) {
		super(Uint8Array, array, componentSize, options);
	}

	protected getTypeByContext(context: WebGLRenderingContextKind): number {
		return context.UNSIGNED_BYTE;
	}
}
