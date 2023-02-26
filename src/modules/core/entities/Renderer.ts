import { createCacheStore, CacheStore } from "@core/shared/helpers/createCacheStore";
import { CompiledWebGLProgram } from "@core/webgl/CompiledWebGLProgram";
import { VariableName } from "@core/shared/enums/variableName";

import type { LikeMatrix4 } from "@core/types";

import { AbstractRenderTarget } from "./abstracts/AbstractRenderTarget";
import { AbstractCamera } from "./abstracts/AbstractCamera";
import { Scene, SceneObject } from "./Scene";
import { Group } from "./Group";
import { Mesh } from "./Mesh";

export class Renderer {
	private _width: number;
	private _height: number;
	private _context: WebGLRenderingContext;
	private _findProgram: CacheStore<
		{ mesh: AbstractRenderTarget; program: CompiledWebGLProgram },
		string
	>;

	constructor(private _canvas: HTMLCanvasElement, options?: WebGLContextAttributes) {
		this._context = _canvas.getContext("webgl", options)!;
		this._findProgram = createCacheStore();
		this._height = 0;
		this._width = 0;

		this._context.enable(this._context.DEPTH_TEST);
		this._context.enable(this._context.CULL_FACE);

		this.updateViewportSize();
	}

	public updateViewportSize(): void {
		const width = this._canvas.clientWidth;
		const height = this._canvas.clientHeight;

		if (this._canvas.width !== width || this._canvas.height !== height) {
			this._canvas.width = width;
			this._canvas.height = height;
		}

		this._context.viewport(0, 0, this._context.drawingBufferWidth, this._context.drawingBufferHeight);

		this._width = width;
		this._height = height;
	}

	public render(scene: Scene, camera: AbstractCamera): void {
		this._context.clearColor(0, 0, 0, 0);
		this._context.clear(this._context.COLOR_BUFFER_BIT | this._context.DEPTH_BUFFER_BIT);
		this.deepRenderObjects(scene.getObjects(), camera.getViewMatrix(this._width, this._height));
	}

	private renderObject(object: AbstractRenderTarget): void {
		if (object instanceof Mesh) {
			const mesh = object as Mesh;
			const compiledProgram = this._findProgram(
				mesh.id,
				(key) => key === mesh.id,
				() => ({
					mesh,
					program: new CompiledWebGLProgram(
						this._context,
						mesh.material.vertexShaderSource,
						mesh.material.fragmentShaderSource
					),
				})
			);

			compiledProgram.program.draw(
				{ attribute: mesh.geometry.verticesPositionAttribute, name: VariableName.POSITION },
				{
					...mesh.material.uniforms,
					[VariableName.RESOLUTION]: [this._width, this._height],
					[VariableName.UV_TRANSFORM]: mesh.transformMatrix,
				},
				mesh.geometry.attributes
			);
		}
	}

	private deepRenderObjects(objects: SceneObject[] = [], viewMatrix: LikeMatrix4): void {
		objects.forEach((object) => {
			object.updateTransformMatrix(viewMatrix);
		});

		const renderObjects = (objects: SceneObject[] = [], parent?: SceneObject): void => {
			const sortedObjects = [...objects].sort(({ zIndex: a }, { zIndex: b }) => a - b);
			sortedObjects.forEach((object) => {
				if (object.hidden) return;

				if (parent) {
				}

				if (object instanceof Group) {
					renderObjects(object.getChildren(), object);
				} else {
					this.renderObject(object);
				}
			});
		};

		renderObjects(objects);
	}
}
