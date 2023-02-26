export const createSourceInjector =
	(pattern: RegExp) =>
	(source: string, blocks: Record<string, string>): string => {
		return source.replaceAll(pattern, (substring, blockName) => {
			if (blocks[blockName]) return blocks[blockName];
			return substring;
		});
	};
