const pattern = /[ ]{0,}?#include[ ]{1,}<([a-z\.\-]+)>[ ]{0,};?/gi;

export const ShaderParser = (shaderSource: string, blocks: Record<string, string>): string => {
	return shaderSource.replaceAll(pattern, (substring, blockName) => {
		if (blocks[blockName]) return blocks[blockName];
		return substring;
	});
};
