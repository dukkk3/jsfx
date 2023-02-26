import { AbstractGeometry } from "./abstracts/entities/AbstractGeometry";
import { AbstractMaterial } from "./abstracts/entities/AbstractMaterial";
import { AbstractMesh } from "./abstracts/entities/AbstractMesh";
import { AbstractScene } from "./abstracts/entities/AbstractScene";

export class Mesh<
	G extends AbstractGeometry = AbstractGeometry,
	M extends AbstractMaterial = AbstractMaterial
> extends AbstractMesh<G, M> {
	constructor(scene: AbstractScene, geometry: G, material: M) {
		super(scene, geometry, material);
	}
}
