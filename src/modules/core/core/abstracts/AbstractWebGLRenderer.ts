import { WebGLRenderingContextKind } from "@core/types";

import { AbstractRenderer } from "./AbstractRenderer";
import { AbstractCamera } from "./entities/AbstractCamera";
import { AbstractScene } from "./entities/AbstractScene";

export abstract class AbstractWebGLRenderer<
	T extends WebGLRenderingContextKind
> extends AbstractRenderer<T> {
	constructor(
		container: HTMLCanvasElement,
		context: T,
		protected options: { depthDisabled?: boolean; cullFaceDisabled?: boolean } = {}
	) {
		super(container, context);
	}

	public render(scene: AbstractScene, camera: AbstractCamera): void {
		super.render(scene, camera);
		if (!this.options.depthDisabled) {
			this.context.enable(this.context.DEPTH_TEST);
		}
		if (!this.options.cullFaceDisabled) {
			this.context.enable(this.context.CULL_FACE);
		}
		this.context.clearColor(0, 0, 0, 0);
		this.context.clear(this.context.COLOR_BUFFER_BIT | this.context.DEPTH_BUFFER_BIT);
	}

	public updateViewportSize(): void {
		const viewportSize = this.getViewportSize();

		if (
			this.container.width !== viewportSize.width ||
			this.container.height !== viewportSize.height
		) {
			this.container.width = viewportSize.width;
			this.container.height = viewportSize.height;
		}

		this.context.viewport(0, 0, this.context.drawingBufferWidth, this.context.drawingBufferHeight);

		this.height = viewportSize.height;
		this.width = viewportSize.width;
	}
}
