import { VariableType } from "../../shared/enums/variableType";
import type { DeepPropsTypeReplacer } from "../../types";

import { attributes as rawAttributes } from "./variables/attributes";
import { uniforms as rawUniforms } from "./variables/uniforms";

const createChunkGenerator =
	(type: string) =>
	(...variables: [string, string][]): string => {
		return variables
			.map(([variableName, variableType]) => `${type} ${variableType} ${variableName};`)
			.join("\n");
	};

const compileObject = <T extends object>(
	object: T
): DeepPropsTypeReplacer<T, VariableType, [string, VariableType]> => {
	const entries = Object.entries(object);
	return entries.reduce(
		(acc, [key, value]) => ({
			...acc,
			[key]: typeof value === "object" ? compileObject(value) : [key, value],
		}),
		{} as any
	);
};

const createUniformChunk = createChunkGenerator("uniform");
const createAttributeChunk = createChunkGenerator("attribute");

const uniforms = compileObject(rawUniforms);
const attributes = compileObject(rawAttributes);

export const shaderChunks: Record<string, string> = {
	"jsfx.vs.vars": [
		createUniformChunk(uniforms.common.resolution, uniforms.common.uvTransform),
		createAttributeChunk(attributes.common.position),
	].join("\n"),
	"jsfx.fs.vars": [createUniformChunk(uniforms.common.resolution, uniforms.common.uvTransform)].join(
		"\n"
	),
};
