import { AbstractWebGLRenderer } from "core_/core/abstracts/AbstractWebGLRenderer";
import { AbstractCamera } from "core_/core/abstracts/entities/AbstractCamera";

import { AbstractScene } from "core_/core/abstracts/entities/AbstractScene";

export class WebGLRenderer extends AbstractWebGLRenderer<WebGLRenderingContext> {
	constructor(container: HTMLCanvasElement, options?: WebGLContextAttributes) {
		super(container, container.getContext("webgl", options)!);
	}

	public render(scene: AbstractScene, camera: AbstractCamera): void {
		super.render(scene, camera);
		scene.applyObjectsMatrices(camera.projectionMatrix);
		scene.renderObjects(this);
	}
}
