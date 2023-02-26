import { AbstractRenderTarget } from "./abstracts/AbstractRenderTarget";
import { AbstractMaterial } from "./abstracts/AbstractMaterial";
import { AbstractGeometry } from "./abstracts/AbstractGeometry";

export class Mesh<
	G extends AbstractGeometry = AbstractGeometry,
	M extends AbstractMaterial = AbstractMaterial
> extends AbstractRenderTarget {
	constructor(public readonly geometry: G, public readonly material: M) {
		super();
	}
}
