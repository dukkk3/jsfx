import { convertUnitTypeToContextUnitType } from "../shared/enums/unitType";
import { UniformValue } from "../types";

import { createWebGLShader } from "./helpers/createWebGLShader";
import { createWebGLProgram } from "./helpers/createWebGLProgram";
import {
	getWebGLProgramAttributesSetters,
	AttributeSetter,
} from "./helpers/getWebGLProgramAttributesSetters";
import {
	getWebGLProgramUniformsSetters,
	UniformSetter,
} from "./helpers/getWebGLProgramUniformsSetters";

import { AbstractAttribute } from "./attributes/AbstractAttribute";

export interface AttributeInfo {
	attribute: AbstractAttribute;
	toDraw?: boolean;
}

export class CompiledWebGLProgram {
	private _program: WebGLProgram;
	private _vertexShader: WebGLShader;
	private _fragmentShader: WebGLShader;
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
		this._vertexShader = vertexShader;
		this._fragmentShader = fragmentShader;
		this._uniformsSetters = uniformsSetters;
		this._attributesSetters = attributesSetters;
	}

	public draw(
		vertexAttributeInfo: { attribute: AbstractAttribute; name: string },
		uniforms: Record<string, UniformValue>,
		attributes: Record<string, AbstractAttribute>
	): void {
		this._context.useProgram(this._program);

		const uniformsNames = Object.keys(uniforms);
		const attributesNames = Object.keys(attributes);

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
			const buffer = attribute.getBufferByContext(this._context);
			if (!setter || !buffer || !attribute) continue;
			setter({
				buffer,
				normalize: attribute.normalize,
				componentSize: attribute.componentSize,
				type: convertUnitTypeToContextUnitType(this._context, attribute.type),
			});
		}

		const vertexAttributeSetter = this._attributesSetters[vertexAttributeInfo.name];
		const vertexAttributeBuffer = vertexAttributeInfo.attribute.getBufferByContext(this._context);

		if (!vertexAttributeSetter || !vertexAttributeBuffer) return;

		vertexAttributeSetter({
			buffer: vertexAttributeBuffer,
			componentSize: vertexAttributeInfo.attribute.componentSize,
			type: convertUnitTypeToContextUnitType(this._context, vertexAttributeInfo.attribute.type),
		});

		this._context.drawArrays(
			this._context.TRIANGLES,
			0,
			vertexAttributeInfo.attribute.componentsCount
		);
	}
}
