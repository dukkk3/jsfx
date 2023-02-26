import type { AbstractObject } from "core_/core/abstracts/entities/AbstractObject";
import type { AbstractGeometry } from "core_/core/abstracts/entities/AbstractGeometry";
import type { AbstractMaterial } from "core_/core/abstracts/entities/AbstractMaterial";
import { AbstractScene } from "core_/core/abstracts/entities/AbstractScene";

import { Mesh } from "core_/core/Mesh";
import { Group } from "core_/core/Group";
import { CacheStorage } from "core_/common/CacheStorage";

import { CompiledWebGLProgram } from "./entities/CompiledWebGLProgram";
import { WebGLRenderer } from "./WebGLRenderer";

export class WebGLScene extends AbstractScene {
	private _programsStore: CacheStorage<Mesh, CompiledWebGLProgram>;

	constructor() {
		super();
		this._programsStore = new CacheStorage();
	}

	public createGroup(...objects: AbstractObject[]): Group {
		return new Group(this, ...objects);
	}

	public createMesh<G extends AbstractGeometry, M extends AbstractMaterial>(
		geometry: G,
		material: M
	): Mesh<G, M> {
		return new Mesh(this, geometry, material);
	}

	public renderObjects(renderer: WebGLRenderer): void {
		this.forEachNonHiddenObjects((object) => {
			if (object instanceof Mesh) {
				const mesh = object as Mesh<AbstractGeometry, AbstractMaterial>;
				const program = this._programsStore.findOrCreateItem(
					(key) => key === mesh,
					() => {
						const program = new CompiledWebGLProgram(
							renderer.context,
							mesh.material.vertexShaderSource,
							mesh.material.fragmentShaderSource
						);
						return {
							key: mesh,
							item: program,
						};
					}
				);

				program.draw(
					"position",
					{ ...mesh.material.uniforms, worldMatrix: mesh.projectionMatrix },
					{ ...mesh.geometry.attributes, position: mesh.geometry.verticesAttribute }
				);
			}
		});
	}
}
