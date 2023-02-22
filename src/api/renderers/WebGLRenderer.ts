import { AbstractRenderer } from "@core/AbstractRenderer";

export class WebGLRenderer extends AbstractRenderer {
	constructor($canvas: HTMLCanvasElement, options?: WebGLContextAttributes) {
		super($canvas, $canvas.getContext("webgl", options)!);
	}
}
