export const WebGLProgram = (
	context: WebGLRenderingContextBase,
	vertexShader: WebGLShader,
	fragmentShader: WebGLShader
): WebGLProgram => {
	const program = context.createProgram()!;

	context.attachShader(program, vertexShader);
	context.attachShader(program, fragmentShader);
	context.linkProgram(program);

	const createStatus = context.getProgramParameter(program, context.LINK_STATUS);

	if (createStatus) {
		return program;
	}

	console.log(context.getProgramInfoLog(program));
	context.deleteProgram(program);

	throw new Error("Creating program error");
};
