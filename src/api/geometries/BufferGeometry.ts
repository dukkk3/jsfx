import { AbstractGeometry, Attributes } from "@core/AbstractGeometry";
import { Attribute } from "@core/shared/Attribute";

export class BufferGeometry<T extends Attributes> extends AbstractGeometry<T> {
	constructor(points: number[], chunkSize: number, attributes?: T) {
		super(new Attribute(points, chunkSize), attributes);
	}
}
