import { AbstractGeometry } from "@core/index";
import { Float32Attribute } from "@core/webgl/attributes/Float32Attribute";
import type { Attributes } from "@core/types";

export class BufferGeometry<T extends Attributes = Attributes> extends AbstractGeometry<T> {
	constructor(vertices: number[], componentSize: number = 3, dynamicDraw?: boolean, attributes?: T) {
		super(new Float32Attribute(vertices, componentSize, dynamicDraw), attributes);
	}
}
