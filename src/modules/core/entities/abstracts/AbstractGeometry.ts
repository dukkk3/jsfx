import { Float32Attribute } from "@core/webgl/attributes/Float32Attribute";
import type { Attributes } from "@core/types";

export abstract class AbstractGeometry<T extends Attributes = Attributes> {
	public readonly attributes: T;

	constructor(public readonly verticesPositionAttribute: Float32Attribute, attributes?: T) {
		this.attributes = attributes || ({} as T);
	}
}
