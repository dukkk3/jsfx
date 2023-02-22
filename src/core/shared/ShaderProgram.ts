import { WebGLUtils, AttributeSetter, UniformSetter } from "@core/utils/WebGLUtils";
import type { WebGLContext } from "@core/types";

import { WebGLShader } from "./WebGLShader";
import { WebGLProgram } from "./WebGLProgram";
import { ShaderParser } from "./ShaderParser";

type AttributeSetterData = Omit<Parameters<AttributeSetter>[0], "buffer">;

export class ShaderProgram {
	public program: WebGLProgram;
	public attributesBuffers: Record<string, WebGLBuffer>;

	private _uniformsSetters: Record<string, UniformSetter>;
	private _attributesSetters: Record<string, (data: AttributeSetterData) => void>;

	constructor(
		public context: WebGLContext,
		vertexShaderSource: string,
		fragmentShaderSource: string,
		shaderSourceBlocks: Record<string, string> = {}
	) {
		const vertexShader = WebGLShader(
			context,
			ShaderParser(vertexShaderSource, shaderSourceBlocks),
			context.VERTEX_SHADER
		);
		const fragmentShader = WebGLShader(
			context,
			ShaderParser(fragmentShaderSource, shaderSourceBlocks),
			context.FRAGMENT_SHADER
		);

		this.program = WebGLProgram(context, vertexShader, fragmentShader);
		this._uniformsSetters = WebGLUtils.getUniformsSetters(context, this.program);

		const attributesSetters = WebGLUtils.getAttributesSetters(context, this.program);
		const attributesNames = Object.keys(attributesSetters);
		this.attributesBuffers = attributesNames.reduce(
			(acc, key) => ({ ...acc, [key]: context.createBuffer() }),
			{}
		);
		this._attributesSetters = attributesNames.reduce(
			(acc, key) => ({
				...acc,
				[key]: (data: AttributeSetterData) =>
					attributesSetters[key]({ ...data, buffer: this.attributesBuffers[key] }),
			}),
			{}
		);
	}

	public setUniformValueByName(name: string, value: any): void {
		if (!this._uniformsSetters[name]) return;
		this._uniformsSetters[name](value);
	}

	public setAttributeValueByName(name: string, data: AttributeSetterData): void {
		if (!this._attributesSetters[name]) return;
		this._attributesSetters[name](data);
	}
}
