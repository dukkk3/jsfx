import { Matrix4 } from "@core/math/Matrix4";
import { Vector3 } from "@core/math/Vector3";
import { LikeMatrix4 } from "@core/types";

import type { AbstractMesh } from "./AbstractMesh";
import type { AbstractLight } from "./AbstractLight";
import type { AbstractGroup } from "./AbstractGroup";
import type { AbstractCamera } from "./AbstractCamera";
import type { AbstractObject } from "./AbstractObject";
import type { AbstractMaterial } from "./AbstractMaterial";
import type { AbstractGeometry } from "./AbstractGeometry";
import type { AbstractRenderer } from "../AbstractRenderer";

export interface ObjectNode {
	object: AbstractObject;
	children: ObjectNode[];
}

export abstract class AbstractScene {
	public translation: Vector3;
	public rotation: Vector3;

	protected _lights: AbstractLight[];
	protected _objects: AbstractObject[];
	protected _objectsTree: ObjectNode[];
	protected _light: Vector3;

	private _worldMatrix: Matrix4;

	protected static sortObjectsByZIndex(objects: AbstractObject[]): AbstractObject[] {
		return [...objects].sort(({ zIndex: a }, { zIndex: b }) => a - b);
	}

	constructor() {
		this._lights = [];
		this._objects = [];
		this._objectsTree = [];
		this._light = new Vector3();
		this._worldMatrix = new Matrix4();

		this.rotation = new Vector3();
		this.translation = new Vector3();
	}

	public abstract createGroup(...objects: AbstractObject[]): AbstractGroup;
	public abstract createMesh<G extends AbstractGeometry, M extends AbstractMaterial>(
		geometry: G,
		material: M
	): AbstractMesh<G, M>;

	public updateObjectsTree(): void {
		const objectsHeap = this._objects;
		const rootObjects = objectsHeap.filter((object) => !object.parent);

		const getNodes = (parent: AbstractObject): ObjectNode => {
			const children = objectsHeap.filter((object) => object.parent === parent);
			return {
				object: parent,
				children: children.length ? AbstractScene.sortObjectsByZIndex(children).map(getNodes) : [],
			};
		};

		this._objectsTree = AbstractScene.sortObjectsByZIndex(rootObjects).map(getNodes);
	}

	public applyObjectsMatrices(): void {
		this._worldMatrix
			.toIdentity()
			.xRotate(this.rotation.x)
			.yRotate(this.rotation.y)
			.zRotate(this.rotation.z)
			.translate(this.translation);

		const objectsTree = this._objectsTree;

		const applyNodesMatrices = (nodes: ObjectNode[], matrix: LikeMatrix4): void => {
			nodes.forEach((node) => {
				node.object.applyMatrix(matrix);

				if (node.children.length) {
					applyNodesMatrices(node.children, node.object.worldMatrix);
				}
			});
		};

		applyNodesMatrices(objectsTree, this._worldMatrix);
	}

	public getObjects(): AbstractObject[] {
		return this._objects;
	}

	public getObjectsTree(): ObjectNode[] {
		return this._objectsTree;
	}

	public forEachObjects(cb: (object: AbstractObject) => void): void {
		const objectsTree = this._objectsTree;
		const forEachObjects = (nodes: ObjectNode[]): void => {
			nodes.forEach((node) => {
				cb(node.object);

				if (node.children.length) {
					forEachObjects(node.children);
				}
			});
		};

		forEachObjects(objectsTree);
	}

	public forEachNonHiddenObjects(cb: (object: AbstractObject) => void): void {
		this.forEachObjects((object) => {
			if (object.hidden) return;
			cb(object);
		});
	}

	public abstract renderObjects(camera: AbstractCamera, renderer: AbstractRenderer): void;

	public addObject(object: AbstractObject): void {
		this._objects.push(object);
		this.updateObjectsTree();
	}

	protected prepareLight(): void {
		this._light.copy([1, 1, 1]);

		for (const light of this._lights) {
			this._light.cross(light.getLight());
		}
	}
}
