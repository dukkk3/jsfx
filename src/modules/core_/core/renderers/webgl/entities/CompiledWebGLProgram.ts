import { AbstractAttribute } from "core_/core/abstracts/entities/AbstractAttribute";
import { UniformValue } from "core_/types";

import { createWebGLShader } from "../common/createWebGLShader";
import { createWebGLProgram } from "../common/createWebGLProgram";
import {
	getWebGLProgramAttributesSetters,
	AttributeSetter,
} from "../common/getWebGLProgramAttributesSetters";
import {
	getWebGLProgramUniformsSetters,
	UniformSetter,
} from "../common/getWebGLProgramUniformsSetters";

export class CompiledWebGLProgram {
	private _program: WebGLProgram;
	private _buffers: Record<string, WebGLBuffer>;
	private _uniformsSetters: Record<string, UniformSetter>;
	private _attributesSetters: Record<string, AttributeSetter>;

	constructor(
		private _context: WebGLRenderingContext,
		vertexShaderSource: string,
		fragmentShaderSource: string
	) {
		const fragmentShader = createWebGLShader(
			_context,
			fragmentShaderSource,
			_context.FRAGMENT_SHADER
		);
		const vertexShader = createWebGLShader(_context, vertexShaderSource, _context.VERTEX_SHADER);
		const program = createWebGLProgram(_context, vertexShader, fragmentShader);
		const uniformsSetters = getWebGLProgramUniformsSetters(_context, program);
		const attributesSetters = getWebGLProgramAttributesSetters(_context, program);

		this._program = program;
		this._uniformsSetters = uniformsSetters;
		this._attributesSetters = attributesSetters;
		this._buffers = Object.keys(this._attributesSetters).reduce(
			(acc, key) => ({ ...acc, [key]: _context.createBuffer()! }),
			{}
		);
	}

	public draw(
		positionAttributeName: string,
		uniforms: Record<string, UniformValue>,
		attributes: Record<string, AbstractAttribute>
	): void {
		this._context.useProgram(this._program);

		const uniformsNames = Object.keys(uniforms);
		const attributesNames = [
			...Object.keys(attributes).filter((attributeName) => positionAttributeName !== attributeName),
			positionAttributeName,
		];

		for (const uniformName of uniformsNames) {
			const setter = this._uniformsSetters[uniformName];
			const uniformValue = uniforms[uniformName];
			if (!setter) continue;
			setter(
				typeof uniformValue === "object" && "toArray" in uniformValue
					? uniformValue.toArray()
					: uniforms[uniformName]
			);
		}

		for (const attributeName of attributesNames) {
			const setter = this._attributesSetters[attributeName];
			const attribute = attributes[attributeName];
			const buffer = this._buffers[attributeName];
			if (!setter || !buffer || !attribute) continue;
			attribute.provideArrayInBufferByContext(this._context, buffer);
			attribute.provideBufferInContext(this._context, buffer, setter);
			if (attributeName === positionAttributeName) {
				this._context.drawArrays(this._context.TRIANGLES, 0, attribute.componentSize);
			}
		}
	}
}
