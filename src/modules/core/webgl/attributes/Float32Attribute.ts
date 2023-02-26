import { UnitType } from "@core/shared/enums/unitType";

import { AbstractAttribute } from "./AbstractAttribute";

export class Float32Attribute extends AbstractAttribute<Float32ArrayConstructor> {
	constructor(array: number[] | Float32Array, componentSize: number, dynamicDraw?: boolean) {
		super(Float32Array, UnitType.FLOAT, array, componentSize, false, dynamicDraw);
	}
}
