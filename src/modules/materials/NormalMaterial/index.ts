import { AbstractMaterial, Uniforms } from "@core/index";

import fragmentShaderSource from "./shader.fs.glsl";
import vertexShaderSource from "./shader.vs.glsl";

export class NormalMaterial<T extends Uniforms = Uniforms> extends AbstractMaterial<T> {
	constructor(uniforms?: T) {
		super(vertexShaderSource, fragmentShaderSource, uniforms);
	}
}
