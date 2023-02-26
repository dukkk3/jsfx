import { Group } from "./Group";
import { AbstractRenderTarget } from "./abstracts/AbstractRenderTarget";

export type SceneObject = AbstractRenderTarget | Group;

export class Scene {
	private _objects: SceneObject[];

	constructor() {
		this._objects = [];
	}

	public addObjects(...objects: SceneObject[]): void {
		this._objects.push(...objects);
	}

	public getObjects(): SceneObject[] {
		return this._objects;
	}
}
