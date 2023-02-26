import { AbstractGeometry } from "./AbstractGeometry";
import { AbstractMaterial } from "./AbstractMaterial";
import { AbstractObject } from "./AbstractObject";
import { AbstractScene } from "./AbstractScene";

export abstract class AbstractMesh<
	G extends AbstractGeometry,
	M extends AbstractMaterial
> extends AbstractObject {
	constructor(scene: AbstractScene, public geometry: G, public material: M) {
		super(scene);
	}
}
