import { VariableName } from "../../../shared/enums/variableName";
import { VariableType } from "../../../shared/enums/variableType";

export const uniforms = {
	common: {
		[VariableName.UV_TRANSFORM]: VariableType.Matrix4,
		[VariableName.RESOLUTION]: VariableType.Vector2,
	},
};
