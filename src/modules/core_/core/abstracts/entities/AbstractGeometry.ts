import { AbstractAttribute } from "./AbstractAttribute";

export interface Attributes extends Record<string, AbstractAttribute> {}

export abstract class AbstractGeometry<
	T extends AbstractAttribute = AbstractAttribute,
	U extends Attributes = Attributes
> {
	public attributes: U;

	constructor(public verticesAttribute: T, attributes?: U) {
		this.attributes = (attributes || {}) as U;
	}
}
