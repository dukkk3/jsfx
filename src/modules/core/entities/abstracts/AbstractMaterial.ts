import { createSourceInjector } from "../../shared/helpers/createSourceInjector";
import { shaderChunks } from "../../webgl/shaders/chunks";
import { Uniforms, UniformValue } from "../../types";

const shaderChunksInjector = createSourceInjector(
	/[ ]{0,}?#include[ ]{1,}<([a-z\.\-]+)>[ ]{0,};?/gi
);

export abstract class AbstractMaterial<T extends Uniforms = Uniforms> {
	public readonly fragmentShaderSource: string;
	public readonly vertexShaderSource: string;
	public readonly uniforms: T;

	constructor(vertexShaderSource: string, fragmentShaderSource: string, uniforms?: T) {
		this.uniforms = uniforms || ({} as T);
		this.fragmentShaderSource = shaderChunksInjector(fragmentShaderSource, shaderChunks);
		this.vertexShaderSource = shaderChunksInjector(vertexShaderSource, shaderChunks);
	}

	public setUniformValueByName<K extends keyof T>(name: K, value: T[K]): void {
		if (name in this.uniforms) this.uniforms[name] = value;
	}

	public unsafeSetUniformValueByName(name: string, value: UniformValue): void {
		this.uniforms[name as keyof T] = value as any;
	}
}
