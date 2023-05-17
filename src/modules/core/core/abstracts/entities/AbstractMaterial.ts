import { UniformValue } from "@core/types";

export type Uniforms = Record<string, UniformValue>;

export abstract class AbstractMaterial<T extends Uniforms = Uniforms> {
	public uniforms: T;

	constructor(
		public readonly vertexShaderSource: string,
		public readonly fragmentShaderSource: string,
		uniforms?: T
	) {
		this.uniforms = (uniforms || {}) as T;
	}

	unsafeSetUniformByName(name: string, value: UniformValue): void {
		this.uniforms[name as keyof T] = value as any;
	}
}
