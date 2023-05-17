import { GLVariableType } from "../enums/glVariableType";
import { ChunkPosition, GLSLBuilder, Variables } from "./GLSLBuilder";

export class VertexShaderBuilder extends GLSLBuilder {
	private _attributes: Variables;

	constructor() {
		super();
		this._varyings = {};
		this._attributes = {};
	}

	public setAttribute(name: string, type: GLVariableType): this {
		this._attributes[name] = type;
		return this;
	}

	public setAttributes(attributes: Variables): this {
		this._attributes = { ...attributes };
		return this;
	}

	public getSource(): string {
		const uniforms = VertexShaderBuilder.formatVariables(this._uniforms, "uniform");
		const varyings = VertexShaderBuilder.formatVariables(this._varyings, "varying");
		const attributes = VertexShaderBuilder.formatVariables(this._attributes, "attribute");

		const chunks = VertexShaderBuilder.formatAndReduceChunksByPosition(this._chunks);

		return `
         ${chunks[ChunkPosition.BEFORE_DECLARATIONS].join("\n")}

         ${attributes.join(";\n")}
         ${uniforms.join(";\n")}
         ${varyings.join(";\n")}

         ${chunks[ChunkPosition.BEFORE_MAIN].join("\n")}

         void main () {
            ${chunks[ChunkPosition.IN_MAIN].join("\n")}
         }
      `;
	}
}
