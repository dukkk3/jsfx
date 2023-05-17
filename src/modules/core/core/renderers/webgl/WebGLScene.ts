import type { AbstractObject } from "@core/core/abstracts/entities/AbstractObject";
import type { AbstractGeometry } from "@core/core/abstracts/entities/AbstractGeometry";
import type { AbstractMaterial } from "@core/core/abstracts/entities/AbstractMaterial";
import type { AbstractCamera } from "@core/core/abstracts/entities/AbstractCamera";
import { AbstractScene } from "@core/core/abstracts/entities/AbstractScene";

import { Mesh } from "@core/core/Mesh";
import { Group } from "@core/core/Group";
import { CacheStorage } from "@core/common/CacheStorage";

import { CompiledWebGLProgram } from "./entities/CompiledWebGLProgram";
import { WebGLRenderer } from "./WebGLRenderer";

export class WebGLScene extends AbstractScene {
	private _programsStore: CacheStorage<Mesh, CompiledWebGLProgram>;

	constructor() {
		super();
		this._programsStore = new CacheStorage();
	}

	public createGroup(...objects: AbstractObject[]): Group {
		const group = new Group(this, ...objects);
		this.addObject(group);
		return group;
	}

	public createMesh<G extends AbstractGeometry<any, any>, M extends AbstractMaterial>(
		geometry: G,
		material: M
	): Mesh<G, M> {
		const mesh = new Mesh(this, geometry, material);
		this.addObject(mesh);
		return mesh;
	}

	public renderObjects(camera: AbstractCamera, renderer: WebGLRenderer): void {
		this.prepareLight();
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
					"a_position",
					{
						...mesh.material.uniforms,
						u_world: mesh.worldMatrix,
						u_projection: camera.projectionMatrix,
						u_view: camera.viewMatrix,
						u_viewWorldPosition: camera.position,
						u_light: this._light,
					},
					{
						...mesh.geometry.attributes,
						a_position: mesh.geometry.verticesAttribute,
						a_normal: mesh.geometry.attributes?.normal,
					}
				);
			}
		});
	}

	public removeObject(object: AbstractObject): void {
		const program = this._programsStore.findItem((key) => key === object);
		if (program) {
		}
	}
}
