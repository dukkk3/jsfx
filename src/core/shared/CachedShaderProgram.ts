import type { WebGLContext } from "@core/types";

import { ShaderProgram } from "./ShaderProgram";

const cachedPrograms: {
	context: WebGLContext;
	program: ShaderProgram;
	objectId: string;
}[] = [];

export const CachedShaderProgram = (
	objectId: string,
	...args: ConstructorParameters<typeof ShaderProgram>
): ShaderProgram => {
	const program = cachedPrograms.find((program) => program.context === args[0] && program.objectId);
	if (program) return program.program;
	const newProgram = new ShaderProgram(...args);
	cachedPrograms.push({ context: args[0], program: newProgram, objectId });
	return newProgram;
};
