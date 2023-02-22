import { AbstractGeometry } from "@core/AbstractGeometry";
import { AbstractMaterial } from "@core/AbstractMaterial";

import { AbstractObject2D } from "./AbstractObject2D";

export class Mesh<
	T extends AbstractGeometry = AbstractGeometry,
	U extends AbstractMaterial = AbstractMaterial
> extends AbstractObject2D {
	constructor(public geometry: T, public material: U) {
		super();
	}
}
