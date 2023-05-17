import type { AbstractCamera } from "./entities/AbstractCamera";
import type { AbstractScene } from "./entities/AbstractScene";

export abstract class AbstractRenderer<T = any> {
	public width!: number;
	public height!: number;

	constructor(public readonly container: HTMLCanvasElement, public readonly context: T) {
		this.updateViewportSize();
		window.addEventListener("resize", () => this.updateViewportSize());
	}

	public abstract updateViewportSize(): void;

	public render(scene: AbstractScene, camera: AbstractCamera): void {
		camera.updateProjectionMatrix(this.width, this.height);
		scene.applyObjectsMatrices();
	}

	protected getViewportSize(): { width: number; height: number } {
		const width = this.container.clientWidth;
		const height = this.container.clientHeight;

		return {
			width,
			height,
		};
	}
}
