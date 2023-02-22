import { AbstractObject2D } from "./AbstractObject2D";

export class Group2D extends AbstractObject2D {
	constructor(public objects: AbstractObject2D[]) {
		super();
	}

	public addObjects(...objects: AbstractObject2D[]): void {
		this.objects.push(...objects);
	}

	public removeObjects(...objects: AbstractObject2D[]): void {
		this.objects = this.objects.filter((object) => !objects.includes(object));
	}
}
