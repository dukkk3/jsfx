import { AbstractObject } from "./AbstractObject";
import type { AbstractScene } from "./AbstractScene";

export abstract class AbstractGroup extends AbstractObject {
	constructor(scene: AbstractScene, ...children: AbstractObject[]) {
		super(scene);
		this.addChildren(...children);
	}

	public addChildren(...children: AbstractObject[]): void {
		children.forEach((children) => {
			children.setParent(this);
		});
	}
}
