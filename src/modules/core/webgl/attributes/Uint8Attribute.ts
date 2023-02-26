import { UnitType } from "@core/shared/enums/unitType";

import { AbstractAttribute } from "./AbstractAttribute";

export class Uint8Attribute extends AbstractAttribute<Uint8ArrayConstructor> {
	constructor(array: number[] | Uint8Array, componentSize: number) {
		super(Uint8Array, UnitType.UNSIGNED_BYTE, array, componentSize, true);
	}
}
