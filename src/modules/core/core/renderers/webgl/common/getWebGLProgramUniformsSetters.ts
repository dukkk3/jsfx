export type UniformSetter = (value: any) => void;

const createUniformSetter = (
	context: WebGLRenderingContext,
	program: WebGLProgram,
	uniformInfo: { type: number; name: string; size: number }
): UniformSetter => {
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
};

export const getWebGLProgramUniformsSetters = (
	context: WebGLRenderingContext,
	program: WebGLProgram
): Record<string, UniformSetter> => {
	const uniformSetters: Record<string, UniformSetter> = {};
	const uniformsCount = context.getProgramParameter(program, context.ACTIVE_UNIFORMS);

	for (let i = 0; i < uniformsCount; ++i) {
		const uniformInfo = context.getActiveUniform(program, i);
		if (!uniformInfo) break;
		let name = uniformInfo.name;
		if (name.slice(-3) === "[0]") {
			name = name.slice(0, name.length - 3);
		}
		const setter = createUniformSetter(context, program, uniformInfo);
		uniformSetters[name] = setter;
	}

	return uniformSetters;
};
