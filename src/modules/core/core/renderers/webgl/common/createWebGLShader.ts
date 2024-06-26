export const createWebGLShader = (
	context: WebGLRenderingContextBase,
	source: string,
	type: number
): WebGLShader => {
	const shader = context.createShader(type)!;
	context.shaderSource(shader, source);
	context.compileShader(shader);

	const compileStatus = context.getShaderParameter(shader, context.COMPILE_STATUS);

	if (compileStatus) {
		return shader;
	}

	console.error(context.getShaderInfoLog(shader));
	context.deleteShader(shader);

	throw new Error("Compile shader error");
};
