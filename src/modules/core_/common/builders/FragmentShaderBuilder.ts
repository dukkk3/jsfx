import { GLVariableType } from "../enums/glVariableType";
import { ChunkPosition, GLSLBuilder, Variables } from "./GLSLBuilder";

export class FragmentShaderBuilder extends GLSLBuilder {
	private _varyings: Variables;

	constructor() {
		super();
		this._varyings = {};
	}

	public setVarying(name: string, type: GLVariableType): this {
		this._varyings[name] = type;
		return this;
	}

	public setVaryings(varyings: Variables): this {
		this._varyings = { ...varyings };
		return this;
	}

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
