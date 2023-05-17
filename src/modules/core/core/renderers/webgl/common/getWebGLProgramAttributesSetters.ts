export interface AttributeSetterData {
	type?: number;
	componentSize?: number;
	normalize?: boolean;
	buffer?: WebGLBuffer;
	value?: Float32Array;
	stride?: number;
	offset?: number;
}

export type AttributeSetter = (data: AttributeSetterData) => void;

const createAttributeSetter = (
	context: WebGLRenderingContext,
	attributeIndex: number
): AttributeSetter => {
	return (data) => {
		if (data.value) {
			context.disableVertexAttribArray(attributeIndex);
			if (data.value.length === 1) return context.vertexAttrib1fv(attributeIndex, data.value);
			if (data.value.length === 2) return context.vertexAttrib2fv(attributeIndex, data.value);
			if (data.value.length === 3) return context.vertexAttrib3fv(attributeIndex, data.value);
			if (data.value.length === 4) return context.vertexAttrib4fv(attributeIndex, data.value);
			throw new Error("The length of a float constant value must be between 1 and 4!");
		}

		context.bindBuffer(context.ARRAY_BUFFER, data.buffer!);
		context.enableVertexAttribArray(attributeIndex);
		context.vertexAttribPointer(
			attributeIndex,
			data.componentSize || 0,
			data.type || context.FLOAT,
			data.normalize || false,
			data.stride || 0,
			data.offset || 0
		);
	};
};

export const getWebGLProgramAttributesSetters = (
	context: WebGLRenderingContext,
	program: WebGLProgram
): Record<string, AttributeSetter> => {
	const attributesSetters: Record<string, AttributeSetter> = {};
	const attributesCount = context.getProgramParameter(program, context.ACTIVE_ATTRIBUTES);

	for (let i = 0; i < attributesCount; ++i) {
		const attributeInfo = context.getActiveAttrib(program, i);

		if (!attributeInfo) {
			break;
		}

		const index = context.getAttribLocation(program, attributeInfo.name);
		attributesSetters[attributeInfo.name] = createAttributeSetter(context, index);
	}

	return attributesSetters;
};
