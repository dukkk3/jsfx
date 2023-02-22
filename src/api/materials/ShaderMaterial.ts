import { AbstractMaterial } from "@core/AbstractMaterial";
import { UniformValue } from "@core/types";

export class ShaderMaterial<
	T extends Record<string, UniformValue> = any
> extends AbstractMaterial<T> {}
