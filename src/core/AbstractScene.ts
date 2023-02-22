import { AbstractObject } from "@core/objects/AbstractObject";

export abstract class AbstractScene {
	constructor(public objects: AbstractObject[] = []) {}

	public addObjects(...objects: AbstractObject[]): void {
		this.objects.push(...objects);
	}
}
