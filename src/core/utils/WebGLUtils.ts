export type AttributeSetter = (data: {
	type?: number;
	chunkSize?: number;
	normalize?: boolean;
	buffer?: WebGLBuffer;
	value?: Float32Array;
	stride?: number;
	offset?: number;
}) => void;

export type UniformSetter = (value: any) => void;

export class WebGLUtils {
	private static createUniformSetter(
		context: WebGLRenderingContextBase & WebGLRenderingContextOverloads,
		program: WebGLProgram,
		uniformInfo: { type: number; name: string; size: number }
	): UniformSetter {
		const { type } = uniformInfo;
		const location = context.getUniformLocation(program, uniformInfo.name);
		const isArray = uniformInfo.size > 1 && uniformInfo.name.slice(-3) === "[0]";

		if (type === context.FLOAT && isArray) return (value: any) => context.uniform1fv(location, value);
		if (type === context.FLOAT) return (value: any) => context.uniform1f(location, value);
		if (type === context.FLOAT_VEC2) return (value: any) => context.uniform2fv(location, value);
		if (type === context.FLOAT_VEC3) return (value: any) => context.uniform3fv(location, value);
		if (type === context.FLOAT_VEC4) return (value: any) => context.uniform4fv(location, value);
		if (type === context.INT && isArray) return (value: any) => context.uniform1iv(location, value);
		if (type === context.INT) return (value: any) => context.uniform1i(location, value);
		if (type === context.INT_VEC2) return (value: any) => context.uniform2iv(location, value);
		if (type === context.INT_VEC3) return (value: any) => context.uniform3iv(location, value);
		if (type === context.INT_VEC4) return (value: any) => context.uniform4iv(location, value);
		if (type === context.BOOL) return (value: any) => context.uniform1iv(location, value);
		if (type === context.BOOL_VEC2) return (value: any) => context.uniform2iv(location, value);
		if (type === context.BOOL_VEC3) return (value: any) => context.uniform3iv(location, value);
		if (type === context.BOOL_VEC4) return (value: any) => context.uniform4iv(location, value);
		if (type === context.FLOAT_MAT2)
			return (value: any) => context.uniformMatrix2fv(location, false, value);
		if (type === context.FLOAT_MAT3)
			return (value: any) => context.uniformMatrix3fv(location, false, value);
		if (type === context.FLOAT_MAT4)
			return (value: any) => context.uniformMatrix4fv(location, false, value);

		throw new Error("unknown type: 0x" + type.toString(16));
	}

	public static getUniformsSetters(
		context: WebGLRenderingContextBase & WebGLRenderingContextOverloads,
		program: WebGLProgram
	) {
		const uniformSetters: Record<string, UniformSetter> = {};
		const uniformsCount = context.getProgramParameter(program, context.ACTIVE_UNIFORMS);

		for (let i = 0; i < uniformsCount; ++i) {
			const uniformInfo = context.getActiveUniform(program, i);
			if (!uniformInfo) break;
			let name = uniformInfo.name;
			if (name.slice(-3) === "[0]") {
				name = name.slice(0, name.length - 3);
			}
			const setter = this.createUniformSetter(context, program, uniformInfo);
			uniformSetters[name] = setter;
		}

		return uniformSetters;
	}

	private static createAttributeSetter(
		context: WebGLRenderingContextBase & WebGLRenderingContextOverloads,
		attributeIndex: number
	): AttributeSetter {
		return (data) => {
			if (data.value) {
				context.disableVertexAttribArray(attributeIndex);
				if (data.value.length === 1) return context.vertexAttrib1fv(attributeIndex, data.value);
				if (data.value.length === 2) return context.vertexAttrib2fv(attributeIndex, data.value);
				if (data.value.length === 3) return context.vertexAttrib3fv(attributeIndex, data.value);
				if (data.value.length === 4) return context.vertexAttrib4fv(attributeIndex, data.value);
				throw new Error("The length of a float constant value must be between 1 and 4!");
			}

			context.bindBuffer(context.ARRAY_BUFFER, data.buffer!);
			context.enableVertexAttribArray(attributeIndex);
			context.vertexAttribPointer(
				attributeIndex,
				data.chunkSize || 0,
				data.type || context.FLOAT,
				data.normalize || false,
				data.stride || 0,
				data.offset || 0
			);
		};
	}

	public static getAttributesSetters(
		context: WebGLRenderingContextBase & WebGLRenderingContextOverloads,
		program: WebGLProgram
	): Record<string, AttributeSetter> {
		const attributesSetters: Record<string, AttributeSetter> = {};
		const attributesCount = context.getProgramParameter(program, context.ACTIVE_ATTRIBUTES);

		for (let i = 0; i < attributesCount; ++i) {
			const attributeInfo = context.getActiveAttrib(program, i);

			if (!attributeInfo) {
				break;
			}

			const index = context.getAttribLocation(program, attributeInfo.name);
			attributesSetters[attributeInfo.name] = this.createAttributeSetter(context, index);
		}

		return attributesSetters;
	}
}
