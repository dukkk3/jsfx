import { MathUtils, WebGLRenderer, WebGLScene } from "@core";

export class FigureMesh extends Mesh<M, G> {
	constructor() {
		super(material, geometry);
	}

	protected onDispose(): void {}

	protected onTick(delta: number): void {
		this.rotation.x += MathUtils.degreesToRadians(10);
		this.position.y += delta;

		this.material.u_time = 10;
	}
}

const renderer = new WebGLRenderer(null as any, { antialias: true, alpha: true });
const scene = new WebGLScene();

const figureMesh = new FigureMesh();
