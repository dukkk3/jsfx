import { AbstractGeometry, Float32Attribute, Attributes, AbstractAttribute } from "@core";

export class BufferGeometry<T extends Attributes = Attributes> extends AbstractGeometry<
	Float32Attribute,
	T
> {
	constructor(
		vertices: number[] | number[][] | AbstractAttribute<Float32ArrayConstructor>,
		componentSize: number = 3,
		attributes?: T
	) {
		super(new Float32Attribute(vertices, componentSize), attributes);
	}
}
