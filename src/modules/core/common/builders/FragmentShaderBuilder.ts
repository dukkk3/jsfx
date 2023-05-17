import { ChunkPosition, GLSLBuilder } from "./GLSLBuilder";

export class FragmentShaderBuilder extends GLSLBuilder {
	public getSource(): string {
		const uniforms = FragmentShaderBuilder.formatVariables(this._uniforms, "uniform");
		const varyings = FragmentShaderBuilder.formatVariables(this._varyings, "varying");

		const chunks = FragmentShaderBuilder.formatAndReduceChunksByPosition(this._chunks);

		return `
         ${chunks[ChunkPosition.BEFORE_DECLARATIONS].join("\n")}

         ${uniforms.join(";\n")}
         ${varyings.join(";\n")}

         ${chunks[ChunkPosition.BEFORE_MAIN].join("\n")}

         void main () {
            ${chunks[ChunkPosition.IN_MAIN].join("\n")}
         }
      `;
	}
}
