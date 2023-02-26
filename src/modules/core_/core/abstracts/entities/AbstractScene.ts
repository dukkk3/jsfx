import { Matrix4 } from "core_/math/Matrix4";
import { LikeMatrix4 } from "@core/types";

import type { AbstractMesh } from "./AbstractMesh";
import type { AbstractGroup } from "./AbstractGroup";
import type { AbstractObject } from "./AbstractObject";
import type { AbstractMaterial } from "./AbstractMaterial";
import type { AbstractGeometry } from "./AbstractGeometry";
import type { AbstractRenderer } from "../AbstractRenderer";

export interface ObjectNode {
	object: AbstractObject;
	children: ObjectNode[];
}

export abstract class AbstractScene {
	public sceneMatrix: Matrix4;

	protected _objects: AbstractObject[];
	protected _objectsTree: ObjectNode[];

	protected static sortObjectsByZIndex(objects: AbstractObject[]): AbstractObject[] {
		return [...objects].sort(({ zIndex: a }, { zIndex: b }) => a - b);
	}

	constructor() {
		this._objects = [];
		this._objectsTree = [];
		this.sceneMatrix = new Matrix4();
	}

	public abstract createGroup(...objects: AbstractObject[]): AbstractGroup;
	public abstract createMesh<G extends AbstractGeometry, M extends AbstractMaterial>(
		geometry: G,
		material: M
	): AbstractMesh<G, M>;

	public updateObjectsTree(): void {
		const objectsHeap = this._objects;
		const rootObjects = objectsHeap.filter((object) => !object.parent);

		const getNodes = (object: AbstractObject): ObjectNode => {
			const children = objectsHeap.filter((object) => object.parent === object);
			return {
				object,
				children: children.length ? AbstractScene.sortObjectsByZIndex(children).map(getNodes) : [],
			};
		};

		this._objectsTree = AbstractScene.sortObjectsByZIndex(rootObjects).map(getNodes);
	}

	public applyObjectsMatrices(matrix: LikeMatrix4): void {
		if (matrix) this.sceneMatrix.copy(matrix);
		const objectsTree = this._objectsTree;

		const applyNodesMatrices = (nodes: ObjectNode[], matrix: LikeMatrix4): void => {
			nodes.forEach((node) => {
				node.object.applyMatrix(matrix);

				if (node.children.length) {
					applyNodesMatrices(node.children, node.object.projectionMatrix);
				}
			});
		};

		applyNodesMatrices(objectsTree, matrix);
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

	public abstract renderObjects(renderer: AbstractRenderer): void;
}
