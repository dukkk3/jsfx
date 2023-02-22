import type { UniformValue } from "@core/types";

export type Uniforms = Record<string, UniformValue>;

export abstract class AbstractMaterial<T extends Uniforms = any> {
	public uniforms: T;
	public uniformsNames!: string[];

	constructor(public vertexShaderSource: string, public fragmentShaderSource: string, uniforms?: T) {
		this.uniforms = (uniforms || {}) as T;
		this.updateUniformNames();
	}

	public setUniformValueByName<K extends keyof T>(
		name: K,
		value: ((prev: T[K]) => T[K]) | T[K]
	): void {
		if (this.uniforms && name in this.uniforms) {
			const newValue = typeof value === "function" ? value(this.uniforms[name]) : value;
			this.uniforms[name] = newValue;
		}
	}

	public forceSetUniformValueByName(name: string, value: UniformValue): void {
		if (name in this.uniforms) {
			this.setUniformValueByName(name, value as any);
		} else {
			this.uniforms[name as keyof T] = value as any;
			this.updateUniformNames();
		}
	}

	protected updateUniformNames() {
		this.uniformsNames = Object.keys(this.uniforms);
	}
}
