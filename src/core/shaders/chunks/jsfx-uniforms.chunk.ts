import { UniformsNamesConfig } from "@core/config/uniforms/UniformsNamesConfig";

export default `
   uniform mat3 ${UniformsNamesConfig.TRANSFORM_MATRIX_UNIFORM_NAME};
   uniform vec2 ${UniformsNamesConfig.RESOLUTION_UNIFORM_NAME};
`;
