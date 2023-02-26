import { AbstractMaterial } from "@core/index";

import fragmentShaderSource from "./shader.fs.glsl";
import vertexShaderSource from "./shader.vs.glsl";

export class BasicMaterial extends AbstractMaterial {
	constructor() {
		super(vertexShaderSource, fragmentShaderSource);
	}
}
