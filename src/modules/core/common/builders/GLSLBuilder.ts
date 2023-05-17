import { GLVariableType } from "../enums/glVariableType";

export enum ChunkPosition {
	BEFORE_DECLARATIONS = "before-declarations",
	BEFORE_MAIN = "before-main",
	IN_MAIN = "in-main",
}

export interface Variables extends Record<string, GLVariableType> {}

interface Chunk {
	position: ChunkPosition;
	priority?: number;
	source: string | string[];
}

export abstract class GLSLBuilder {
	protected _uniforms: Variables;
	protected _varyings: Variables;
	protected _chunks: Chunk[];

	protected static formatVariables(variables: Variables, prefix: string): string[] {
		return Object.entries(variables).map(([name, type]) => [prefix, type, name].join(" "));
	}

	protected static formatAndReduceChunksByPosition(
		chunks: Chunk[]
	): Record<ChunkPosition, string[]> {
		const positions = Object.values(ChunkPosition);
		const formattedChunks = [...chunks]
			.map((chunk) => ({ ...chunk, priority: chunk.priority || 0 }))
			.sort(({ priority: a }, { priority: b }) => a - b);

		return positions.reduce((acc, position) => {
			const chunks = formattedChunks
				.filter((chunk) => chunk.position === position)
				.map((chunk) => (Array.isArray(chunk.source) ? chunk.source.join("\n") : chunk.source));
			return {
				...acc,
				[position]: chunks,
			};
		}, {} as any);
	}

	constructor() {
		this._uniforms = {};
		this._varyings = {};
		this._chunks = [];
	}

	public setVarying(name: string, type: GLVariableType): this {
		this._varyings[name] = type;
		return this;
	}

	public setVaryings(varyings: Variables): this {
		this._varyings = { ...varyings };
		return this;
	}

	public setUniform(name: string, type: GLVariableType): this {
		this._uniforms[name] = type;
		return this;
	}

	public setUniforms(uniforms: Variables): this {
		this._uniforms = { ...uniforms };
		return this;
	}

	public addChunk(chunk: Chunk): this {
		this._chunks.push(chunk);
		return this;
	}

	public abstract getSource(): string;
}
